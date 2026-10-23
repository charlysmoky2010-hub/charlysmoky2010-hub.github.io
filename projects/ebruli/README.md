# Ebruli — Su Lalesi

Independent ebru art, digital studio and cultural-event project. Historical deployment records are not proof of current public availability or readiness for orders.

## Historically deployed surfaces (live HTTP reachability not independently verified on 2026-10-23)

- Main website: https://ebruli-su-lalesi-live.vercel.app
- Water Tulip Art Pack delivery: historical checkout redirect design; payment link currently inactive, delivery not recently verified
- Vercel main project: `ebruli-su-lalesi-live`
- Vercel delivery project: `ebruli-wt-pack-9q7k2m`

## Languages

Default: English

Supported interface languages:

- English
- German
- Dutch
- Spanish
- Arabic with RTL layout

## Historical commerce wiring — payment links independently verified inactive on 2026-10-23

### Water Tulip Art Pack — EUR 19

- Stripe product: `prod_UwfV8uTlXoGvm6`
- Stripe price: `price_1TwmAgGup9HWwEMCkf2LnmSn`
- Historical Stripe Payment Link: `plink_1TwmB5Gup9HWwEMCQ2Ao7a7M` — **inactive**
- Delivery: instant redirect to a no-index page generating 12 downloadable 2400 × 3000 PNG artworks

### Online Ebru Workshop — EUR 49

- Stripe product: `prod_UwfVL0hWunZ1SX`
- Stripe price: `price_1TwmAtGup9HWwEMCDUmXgLQz`
- Historical Stripe Payment Link: `plink_1TwmBAGup9HWwEMC7ns8cxrX` — **inactive**
- Fulfilment: scheduling by checkout email

### Custom Digital Ebru Commission — EUR 79

- Stripe product: `prod_UwfWjxzbJlyBJb`
- Stripe price: `price_1TwmAyGup9HWwEMC1elGgR8A`
- Historical Stripe Payment Link: `plink_1TwmBHGup9HWwEMCu5fpdKMR` — **inactive**
- Fulfilment: customer preferences and delivery coordinated by checkout email


## Current non-binding commission inquiry

- EBRULI landing page: https://vlgibwclecuhnnrgycnx.supabase.co/functions/v1/ebruli-store?locale=en
- Public source page: https://charlysmoky2010-hub.github.io/offers.html#ebruli
- The commission request redirects to an existing Jotform URL via the EBRULI Edge Function, with an allowlist and UTM attribution.
- Product control state: `verification`, `approval_first=true`, `inquiry_only=true`, `checkout_open=false`.
- Reference price: EUR 79, **not a charged order**. The studio does not charge on this inquiry route.
- The actual public HTTP response, Jotform acceptance and completed delivery are not yet independently verified. Never claim a sale on the strength of an active Stripe product or a submitted inquiry.
- There is a separate newer live Stripe payment link; its existence does **not** bypass the canonical merchant-release conditions. Do not route incomplete offers to it.

## Current interactive features

- Water-tulip hero identity
- Browser-based digital ebru canvas
- Generate, comb, save and PNG-download controls
- Multilingual Ebruli Assistant
- Verified product and price answers
- Explicit refusal to invent event dates, venues, capacity or partners
- Historical Stripe checkout integration; the three payment links above are now inactive
- Automated digital Art Pack delivery after payment

## Separation boundary

Ebruli is an independent project. It does not replace, overwrite or merge with CERBERRUS. CERBERRUS may learn from the documented architecture and decisions, but the artistic identity and commerce records remain separately owned.

## Next development priorities

1. Add real Yusuf Şen ebru photographs and videos after they are supplied.
2. Add legal pages and verified business/public contact information.
3. Add workshop availability and calendar booking.
4. Add commission intake fields and delivery workflow.
5. Connect Ebruli Assistant to a server-side AI model and verified knowledge base.
6. Add privacy-respecting analytics and conversion tracking.
7. Establish GitHub-to-Vercel automated production deployment.

## Commercial truth boundary

- A product being live does not prove revenue.
- Only completed Stripe payments count as sales.
- Unconfirmed event facts must never be published.
- No income or growth guarantee is made.
