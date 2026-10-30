/* Anatolian Atlas sales gate v1 — display-only fail-closed control.
   This public JSON is NOT payment or fulfilment authorization.
   Server-side CERBERRUS commerce readiness remains authoritative. */
(function () {
  'use strict';
  var cta = document.getElementById('paid-cta');
  var status = document.getElementById('sales-gate-status');
  if (!cta || !status) return;
  function validCheckout(value) {
    try {
      var u = new URL(value);
      return u.protocol === 'https:' &&
        u.username === '' && u.password === '' && u.port === '' &&
        !u.search && !u.hash && (
          (u.hostname === 'ko-fi.com' &&
           u.pathname.startsWith('/s/') &&
           /^[A-Za-z0-9_-]{5,64}$/.test(u.pathname.slice(3))) ||
          (u.hostname === 'buy.stripe.com' &&
           u.pathname.startsWith('/') &&
           /^[A-Za-z0-9]{8,90}$/.test(u.pathname.slice(1)))
        );
    } catch (_) { return false; }
  }
  function failClosed() {
    cta.setAttribute('href', 'free-wave-exercise.html');
    cta.textContent = 'Try the free printable worksheet';
    cta.removeAttribute('target');
    cta.removeAttribute('rel');
    status.textContent = 'The full INK & WATER workbook is not available for checkout yet. No payment is taken here.';
  }
  failClosed();
  fetch('ink-water-release.json', {cache: 'no-store', credentials: 'same-origin'})
    .then(function (r) { if (!r.ok) throw new Error('release unavailable'); return r.json(); })
    .then(function (d) {
      if (!d || d.schema !== 'anatolian-atlas-sales-gate-v1' ||
          d.product_slug !== 'anatolian-atlas-ink-water-printable-studio-a4' ||
          d.state !== 'live' ||
          d.display_price_eur !== 8.90 || d.currency !== 'EUR' ||
          d.owner_release_approved !== true ||
          d.verified_paid_fulfillment !== true ||
          d.verified_product_rights !== true ||
          d.verified_merchant_compliance !== true ||
          !validCheckout(d.checkout_url)) return;
      var host = new URL(d.checkout_url).hostname;
      if (host === 'buy.stripe.com' &&
          (d.checkout_provider !== 'stripe' ||
           d.verified_stripe_price_mapping !== true ||
           !d.stripe_draft || d.stripe_draft.product_active !== true ||
           d.stripe_draft.price_active !== true ||
           !/^prod_[A-Za-z0-9]{8,90}$/.test(d.stripe_draft.product_id || '') ||
           !/^price_[A-Za-z0-9]{8,90}$/.test(d.stripe_draft.price_id || ''))) return;
      cta.href = d.checkout_url;
      cta.textContent = 'Buy INK & WATER — €8.90';
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      status.textContent = host === 'ko-fi.com'
        ? 'Secure checkout is provided by Ko-fi. After payment, download the PDF files through Ko-fi.'
        : 'Secure checkout is provided by Stripe. Digital delivery is available only after independently verified payment and secure fulfillment.';
    })
    .catch(function () { failClosed(); });
}());
