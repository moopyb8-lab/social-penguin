// api/create-checkout-session.js
// Creates a Stripe Checkout session and returns the hosted URL.
//
// Required env vars in Vercel:
//   STRIPE_SECRET_KEY
//   STRIPE_PRO_MONTHLY_PRICE_ID
//   STRIPE_PRO_ANNUAL_PRICE_ID
//   STRIPE_GROWTH_MONTHLY_PRICE_ID
//   STRIPE_GROWTH_ANNUAL_PRICE_ID

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map plan + billing period to your Stripe Price IDs.
// After creating prices in the Stripe dashboard, paste the price_xxx IDs here
// OR set them as environment variables (recommended).
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, isAnnual, uid, email } = req.body;

  if (!plan || !uid || !email) {
    return res.status(400).json({ error: 'Missing required fields: plan, uid, email' });
  }

  const billingKey = isAnnual ? 'annual' : 'monthly';
  const priceId = PRICE_IDS[plan]?.[billingKey];

  if (!priceId) {
    return res.status(400).json({ error: `No price configured for plan "${plan}" (${billingKey})` });
  }

  try {
    // Check if this Firebase user already has a Stripe customer ID stored.
    // If so, re-use it so payment methods are preserved.
    // (You can skip this and just pass email if you prefer simplicity.)
    let customerId;
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    }

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      // Pass Firebase UID so the webhook can update the right Firestore doc
      client_reference_id: uid,
      metadata: { uid, plan, billingPeriod: billingKey },
      // Pre-fill the customer's email
      customer_email: customerId ? undefined : email,
      customer: customerId || undefined,
      success_url: 'https://socialpenguin.net/?checkout=success',
      cancel_url:  'https://socialpenguin.net/?page=pricing',
      // Allow promo codes (optional — remove if you don't want this)
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { uid, plan },
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
