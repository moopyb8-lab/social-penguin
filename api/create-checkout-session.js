import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    annual:  process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
  growth: {
    monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
    annual:  process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID,
  },
};

const PACK_PRICE_IDS = {
  pack_20:  process.env.STRIPE_PACK_20_PRICE_ID,
  pack_50:  process.env.STRIPE_PACK_50_PRICE_ID,
  pack_100: process.env.STRIPE_PACK_100_PRICE_ID,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, pack, isAnnual, uid, email } = req.body;
  if (!uid || !email) {
    return res.status(400).json({ error: 'Missing uid or email' });
  }

  try {
    // Get or create customer
    let customerId;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const c = await stripe.customers.create({ email, metadata: { uid } });
      customerId = c.id;
    }

    // ── One-time pack ─────────────────────────────────────────────────────────
    if (pack) {
      const priceId = PACK_PRICE_IDS[pack];
      if (!priceId) return res.status(400).json({ error: `No price for pack "${pack}"` });

      const price = await stripe.prices.retrieve(priceId);
      const pi = await stripe.paymentIntents.create({
        amount: price.unit_amount,
        currency: price.currency,
        customer: customerId,
        metadata: { uid, pack },
        automatic_payment_methods: { enabled: true },
      });
      return res.status(200).json({ clientSecret: pi.client_secret });
    }

    // ── Subscription plan ─────────────────────────────────────────────────────
    if (plan) {
      const billingKey = isAnnual ? 'annual' : 'monthly';
      const priceId = PRICE_IDS[plan]?.[billingKey];
      if (!priceId) return res.status(400).json({ error: `No price for plan "${plan}" (${billingKey})` });

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
        metadata: { uid, plan },
      });

      if (subscription.status === 'active' || subscription.status === 'trialing') {
        return res.status(200).json({ alreadyActive: true });
      }

      // Try payment_intent on the invoice (normal case)
      let clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

      // Try pending_setup_intent (trial or $0 invoice case)
      if (!clientSecret) {
        clientSecret = subscription.pending_setup_intent?.client_secret;
      }

      // Last resort: retrieve the invoice manually with expansion
      if (!clientSecret && subscription.latest_invoice) {
        const invoiceId = typeof subscription.latest_invoice === 'string'
          ? subscription.latest_invoice
          : subscription.latest_invoice.id;
        const invoice = await stripe.invoices.retrieve(invoiceId, {
          expand: ['payment_intent'],
        });
        clientSecret = invoice.payment_intent?.client_secret;
      }

      if (!clientSecret) {
        return res.status(500).json({
          error: `Could not initialize payment (subscription status: ${subscription.status}). Please contact support.`,
        });
      }

      return res.status(200).json({ clientSecret });
    }

    return res.status(400).json({ error: 'Missing plan or pack' });

  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
