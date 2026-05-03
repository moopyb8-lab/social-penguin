# Social Penguin — Stripe Setup Checklist

## 1. Install packages (in your project root)
```bash
npm install stripe firebase-admin
```

## 2. Vercel Environment Variables
Add all of these in Vercel dashboard → Settings → Environment Variables:

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API Keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Developers → Webhooks → your endpoint → Signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe dashboard → Product Catalog → Social Penguin Pro → Monthly price → copy `price_xxx` |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | Same product → Annual price |
| `STRIPE_GROWTH_MONTHLY_PRICE_ID` | Growth product → Monthly price |
| `STRIPE_GROWTH_ANNUAL_PRICE_ID` | Growth product → Annual price |
| `FIREBASE_PROJECT_ID` | Firebase console → Project settings → General → Project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase console → Project settings → Service accounts → Generate new private key → `client_email` field |
| `FIREBASE_PRIVATE_KEY` | Same JSON file → `private_key` field (paste the whole thing including `-----BEGIN...`) |

## 3. Stripe Dashboard Setup

### Create Products
1. Stripe dashboard → Product Catalog → Add Product → "Social Penguin Pro"
2. Add recurring price: $9.99/month → copy Price ID
3. Add recurring price: $6.99/month billed annually → copy Price ID
4. Repeat for "Social Penguin Growth" ($20/mo, $13.99/mo annual)

### Register Webhook
1. Stripe dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://socialpenguin.net/api/webhook`
3. Enable these events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret** → paste into `STRIPE_WEBHOOK_SECRET` env var

### Enable Customer Portal
1. Stripe dashboard → Settings → Billing → Customer Portal
2. Click **Activate portal**
3. Configure: allow cancellation, allow plan changes, allow payment method updates

## 4. Frontend Changes

### Add to app_min.js
Paste the entire contents of `stripe-frontend.js` into your app_min.js.

### Update your pricing page upgrade buttons
Replace whatever onclick you have on upgrade buttons with:
```html
<!-- Starter plan has no upgrade button (it's free) -->

<!-- Pro plan -->
<button onclick="handleUpgrade('pro', isAnnual)">
  Get Pro
</button>

<!-- Growth plan -->
<button onclick="handleUpgrade('growth', isAnnual)">
  Get Growth
</button>
```
`isAnnual` should be the current value of your billing toggle variable (already `false`/`true` based on `toggleBilling()`).

### Update Settings page cancel button
Replace `onclick="promptCancelSub()"` — it already calls the right function, no change needed.
The updated `promptCancelSub()` in stripe-frontend.js now routes to the real Stripe portal.

### Add to window load handler
```javascript
window.addEventListener('load', () => {
  carouselInit();
  carouselStartAuto();
  checkCheckoutSuccess(); // ← add this line
});
```

### Optional: Add success banner HTML
```html
<div id="checkoutSuccessBanner" style="display:none; position:fixed; top:20px; right:20px;
  background:linear-gradient(135deg,#7c3aed,#ec4899); color:#fff; padding:14px 22px;
  border-radius:12px; font-family:'DM Sans',sans-serif; z-index:9999; transition:opacity 0.4s;">
  🎉 You're now on the Pro plan. Welcome!
</div>
```

## 5. API Files
Drop the three files from the `api/` folder into your project's `api/` folder (same place as your existing `generate.js`).

## 6. Test
1. Make sure Vercel is in test mode (use `STRIPE_SECRET_KEY = sk_test_...`)
2. Click an upgrade button → should redirect to Stripe checkout
3. Use test card: `4242 4242 4242 4242`, any future expiry, any CVC
4. After payment, Stripe fires `checkout.session.completed` webhook → Firestore plan updates
5. Check Firebase console → your user doc should now show `plan: "pro"`
