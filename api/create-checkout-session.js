import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  pro:    { monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID    },
  growth: { monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID, annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID },
};

const PACK_PRICE_IDS = {
  pack_20:  process.env.STRIPE_PACK_20_PRICE_ID,
  pack_50:  process.env.STRIPE_PACK_50_PRICE_ID,
  pack_100: process.env.STRIPE_PACK_100_PRICE_ID,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan, pack, isAnnual, uid, email } = req.body;
  if (!uid || !email) return res.status(400).json({ error: 'Missing uid or email' });

  try {
    let customerId;
    const existing = await stripe.customers.list({ email, limit: 1 });
    customerId = existing.data.length > 0
      ? existing.data[0].id
      : (await stripe.customers.create({ email, metadata: { uid } })).id;

    // ── One-time pack ────────────────────────────────────────────────────────
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
      return res.status(200).json({ clientSecret: pi.client_secret, type: 'payment' });
    }

    // ── Subscription: collect payment method first via SetupIntent ───────────
    if (plan) {
      const billingKey = isAnnual ? 'annual' : 'monthly';
      if (!PRICE_IDS[plan]?.[billingKey]) {
        return res.status(400).json({ error: `No price for plan "${plan}" (${billingKey})` });
      }
      const si = await stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: { enabled: true },
        usage: 'off_session',
        metadata: { uid, plan, billingKey, customerId },
      });
      return res.status(200).json({ clientSecret: si.client_secret, type: 'setup', plan, billingKey });
    }

    return res.status(400).json({ error: 'Missing plan or pack' });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
