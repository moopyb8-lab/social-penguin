// api/webhook.js
// Listens for Stripe events and keeps Firestore in sync.
//
// Required env vars in Vercel:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET        ← get this from Stripe dashboard > Webhooks > your endpoint
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY         ← paste the full private key (with \n newlines)
//
// In Stripe dashboard, register: https://socialpenguin.net/api/webhook
// Events to enable:
//   checkout.session.completed
//   customer.subscription.deleted
//   invoice.payment_failed

import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialise Firebase Admin (runs once per cold start)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel stores env vars as strings — replace escaped newlines
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();

// Map Stripe price IDs back to plan names so we know what to write to Firestore.
// Add every Price ID you create in Stripe here.
const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRO_MONTHLY_PRICE_ID]:    'pro',
  [process.env.STRIPE_PRO_ANNUAL_PRICE_ID]:     'pro',
  [process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID]: 'growth',
  [process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID]:  'growth',
};

// Vercel: disable body parsing so we get the raw buffer for Stripe signature verification
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const rawBody = await getRawBody(req);
  const sig     = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      // ── User completed checkout ───────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object;
        const uid = session.client_reference_id;
        if (!uid) break;

        // Determine plan from the subscription's price
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = PRICE_TO_PLAN[priceId] || session.metadata?.plan || 'pro';

        await db.collection('users').doc(uid).update({
          plan,
          stripeCustomerId:     session.customer,
          stripeSubscriptionId: session.subscription,
          planUpdatedAt:        new Date().toISOString(),
        });

        console.log(`✓ checkout.session.completed: uid=${uid} plan=${plan}`);
        break;
      }

      // ── Subscription cancelled / expired ─────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId   = subscription.customer;

        // Find the user by their stored Stripe customer ID
        const snap = await db.collection('users')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!snap.empty) {
          const uid = snap.docs[0].id;
          await db.collection('users').doc(uid).update({
            plan:          'free',
            planUpdatedAt: new Date().toISOString(),
          });
          console.log(`✓ subscription.deleted: uid=${uid} → free`);
        }
        break;
      }

      // ── Payment failed ────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice    = event.data.object;
        const customerId = invoice.customer;

        // Optional: mark the account as payment_failed so you can show
        // a banner in the UI asking them to update their card.
        const snap = await db.collection('users')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!snap.empty) {
          const uid = snap.docs[0].id;
          await db.collection('users').doc(uid).update({
            paymentFailed: true,
          });
          console.log(`⚠ invoice.payment_failed: uid=${uid}`);
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).send('Internal error');
  }

  return res.status(200).json({ received: true });
}
