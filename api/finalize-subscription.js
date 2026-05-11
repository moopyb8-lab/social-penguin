import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  pro:    { monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID    },
  growth: { monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID, annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { setupIntentId, plan, billingKey, uid } = req.body;
  if (!setupIntentId || !plan || !billingKey || !uid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    if (setupIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment method not confirmed yet' });
    }

    const priceId = PRICE_IDS[plan]?.[billingKey];
    if (!priceId) return res.status(400).json({ error: `No price for ${plan} ${billingKey}` });

    const subscription = await stripe.subscriptions.create({
      customer: setupIntent.customer,
      items: [{ price: priceId }],
      default_payment_method: setupIntent.payment_method,
      metadata: { uid, plan },
    });

    return res.status(200).json({ success: true, subscriptionId: subscription.id, status: subscription.status });
  } catch (err) {
    console.error('Finalize subscription error:', err);
    return res.status(500).json({ error: err.message });
  }
}
