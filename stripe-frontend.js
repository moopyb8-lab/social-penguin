// ─────────────────────────────────────────────
// STRIPE FRONTEND — add this block to app_min.js
// ─────────────────────────────────────────────

// ── Upgrade to paid plan ──────────────────────
// Call this from your pricing page upgrade buttons, e.g.:
//   <button onclick="handleUpgrade('pro', false)">Get Pro Monthly</button>
//   <button onclick="handleUpgrade('pro', true)">Get Pro Annual</button>
//   <button onclick="handleUpgrade('growth', false)">Get Growth Monthly</button>
//   <button onclick="handleUpgrade('growth', true)">Get Growth Annual</button>
async function handleUpgrade(plan, isAnnual = false) {
  const user = window._spUser;
  if (!user) {
    showPage('login');
    return;
  }

  // Show loading state on whichever button triggered this
  const btn = event?.target;
  const origText = btn?.textContent;
  if (btn) {
    btn.textContent = 'Redirecting…';
    btn.disabled = true;
  }

  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        isAnnual,
        uid: user.uid,
        email: user.email,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to create checkout session.');
    }

    // Redirect to Stripe's hosted checkout page
    window.location.href = data.url;

  } catch (err) {
    console.error('Stripe checkout error:', err);
    alert('Something went wrong starting checkout. Please try again.');
    if (btn) {
      btn.textContent = origText;
      btn.disabled = false;
    }
  }
}

// ── Open Stripe Customer Portal (manage / cancel) ──
// Call this from Settings page instead of promptCancelSub()
// e.g.: <button onclick="openCustomerPortal()">Manage Subscription</button>
async function openCustomerPortal() {
  const user = window._spUser;
  if (!user) {
    showPage('login');
    return;
  }

  const btn = event?.target;
  const origText = btn?.textContent;
  if (btn) {
    btn.textContent = 'Loading…';
    btn.disabled = true;
  }

  try {
    const res = await fetch('/api/customer-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to open portal.');
    }

    window.location.href = data.url;

  } catch (err) {
    console.error('Customer portal error:', err);
    alert('Could not open billing portal. Please try again.');
    if (btn) {
      btn.textContent = origText;
      btn.disabled = false;
    }
  }
}

// ── Replace the existing promptCancelSub() with this ──
// The old version just zeroed Firestore locally.
// This version sends the user to the real Stripe portal to cancel.
function promptCancelSub() {
  showConfirmModal(
    'Manage your subscription?',
    'You will be taken to the billing portal to cancel or make changes. Your access continues until the end of the billing period.',
    () => openCustomerPortal()
  );
}

// ── Handle post-checkout success ──────────────────────
// Add ?checkout=success to your success_url in create-checkout-session.js
// Then call this on page load to show a success banner.
// Add to your window load handler or showPage('dashboard') call.
function checkCheckoutSuccess() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('checkout') === 'success') {
    // Clean the URL
    window.history.replaceState({}, '', window.location.pathname);
    // Reload user data from Firestore so the plan chip updates
    if (window._fb && window._fb.auth.currentUser) {
      const uid = window._fb.auth.currentUser.uid;
      window._fb.getDoc(window._fb.doc(window._fb.db, 'users', uid)).then(snap => {
        if (snap.exists()) {
          window._spUser = snap.data();
          updateNavAuth();
          loadDashboard();
        }
      });
    }
    // Show a success toast / banner — wire this to whatever toast you use
    const banner = document.getElementById('checkoutSuccessBanner');
    if (banner) {
      banner.classList.add('show');
      setTimeout(() => banner.classList.remove('show'), 5000);
    }
  }
}

// Call checkCheckoutSuccess() inside your existing window load handler:
//   window.addEventListener('load', () => { ...; checkCheckoutSuccess(); });
