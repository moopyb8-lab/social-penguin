// api/create-checkout-session.js
// Creates a Stripe Checkout session and returns the hosted URL.
//
// Required env vars in Vercel:
//   STRIPE_SECRET_KEY
//   STRIPE_PRO_MONTHLY_PRICE_ID
//   STRIPE_PRO_ANNUAL_PRICE_ID
//   STRIPE_GROWTH_MONTHLY_PRICE_ID
//   STRIPE_GROWTH_ANNUAL_PRICE_ID
//   STRIPE_PACK_20_PRICE_ID
//   STRIPE_PACK_50_PRICE_ID
//   STRIPE_PACK_100_PRICE_ID

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
    return res.status(400).json({ error: 'Missing required fields: uid, email' });
  }

  // One-time generation pack purchase
  if (pack) {
    const priceId = PACK_PRICE_IDS[pack];
    if (!priceId) {
      return res.status(400).json({ error: `No price configured for pack "${pack}"` });
    }

    try {
      let customerId;
      const existingCustomers = await stripe.customers.list({ email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: uid,
        metadata: { uid, pack },
        customer_email: customerId ? undefined : email,
        customer: customerId || undefined,
        success_url: 'https://socialpenguin.net/dashboard?checkout=success',
        cancel_url:  'https://socialpenguin.net/pricing',
        allow_promotion_codes: true,
      });

      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error('Stripe error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Subscription plan purchase
  if (!plan) {
    return res.status(400).json({ error: 'Missing required field: plan or pack' });
  }

  const billingKey = isAnnual ? 'annual' : 'monthly';
  const priceId = PRICE_IDS[plan]?.[billingKey];

  if (!priceId) {
    return res.status(400).json({ error: `No price configured for plan "${plan}" (${billingKey})` });
  }

  try {
    let customerId;
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: uid,
      metadata: { uid, plan, billingPeriod: billingKey },
      customer_email: customerId ? undefined : email,
      customer: customerId || undefined,
      success_url: 'https://socialpenguin.net/dashboard?checkout=success',
      cancel_url:  'https://socialpenguin.net/pricing',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { uid, plan },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
