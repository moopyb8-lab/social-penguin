// api/customer-portal.js
// Creates a Stripe Customer Portal session so users can manage
// their subscription (cancel, change plan, update card) without
// you having to build any billing UI.
//
// Required env vars in Vercel:
//   STRIPE_SECRET_KEY
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY
//
// Enable the Customer Portal in Stripe dashboard:
//   Settings → Billing → Customer Portal → Activate

import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    // Look up the user's Stripe customer ID from Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { stripeCustomerId } = userDoc.data();

    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'No active subscription found for this account.' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer:   stripeCustomerId,
      return_url: 'https://socialpenguin.net/?page=settings',
    });

    return res.status(200).json({ url: portalSession.url });

  } catch (err) {
    console.error('Customer portal error:', err);
    return res.status(500).json({ error: err.message });
  }
}
