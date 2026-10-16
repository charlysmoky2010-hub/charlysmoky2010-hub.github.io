# Anatolian Atlas — Digital Cooperative Operating Layer / V1
Date: 2026-10-16. Status: technical pilot; **NOT** an eingetragene Genossenschaft (eG). No statutory membership, cooperative shares or fundraising.

## Verified system of record
Existing primary tables are `public.aa_makers`, `public.aa_products`, `public.aa_orders`, and `public.aa_commissions`. The new governance layer reuses these tables instead of copying products or inventing sellers.

Supabase project: `vlgibwclecuhnnrgycnx`.
Migrations installed: `atlas_coop_secure_governance_v1`, `atlas_coop_integrity_guards_v2`.

| Table | Role |
| --- | --- |
| atlas_coop_members | One verified Auth identity per application, human-reviewed maker link; separate applicant, active and legal statuses |
| atlas_coop_proposals | Draft/open/closed democratic proposals; only active verified makers can propose a draft |
| atlas_coop_votes | One ballot per member per motion, DB-guarded and immutable |
| atlas_coop_events | Append-only motion/application/vote/status-change evidence ledger |
| atlas_coop_distribution_policies | Basis-point policies summing to 100%, subject to a passed closed motion plus written agreement |
| atlas_coop_money_events | Money ledger referencing existing commissions and provider evidence; **INSERT IS LOCKED** until an independently verified provider readback is installed |

### Security
All six tables have Postgres RLS enabled, no anonymous read or authenticated direct inserts; only the Edge server role can operate them. The existing `anatolian-atlas-store` Edge Function, version 13, has isolated `?action=coop_*` routes. These routes preserve all earlier store/form functionality. Public reads return aggregates and published motion text only. Writes require an individually verified Supabase Auth JWT and are subject to strict server role and DB constraints.

Important: email sign-up and account login use a public Supabase publishable key. Never expose service-role credentials or private provider identity documents in frontend code. No automated marketing, payment, payout or merchant approval.

### Routes
- GET `?action=coop_status`: aggregate counters without private identities
- GET `?action=coop_motions`: reviewed public motions
- GET `?action=coop_me`: current application's status after Auth verification
- POST `?action=coop_apply`: self-service candidate application with explicit consent, once per Auth account
- POST `?action=coop_propose`: verified active maker drafts a motion; rate-limited to two/day
- POST `?action=coop_vote`: verified active maker casts immutable unique yes/no/abstain ballot in open window

The public producer portal is at `/anatolian-atlas/cooperative.html` or `/anatolian-atlas/kooperative.html`.

### First-miler onboarding, verified 2026-10-16
The original `anatolian-atlas-store` (GET `?locale=de#join` or `?locale=en#join`) already operates a consent-gated **maker expression-of-interest** form. It writes only genuine voluntary submissions to `public.aa_leads` with `source_system=anatolian_atlas_portal_v1`, `source_form_id=maker_application`, and `consent_to_contact=true`.

The public cooperative homepage now prominently directs first-time makers to this **no-account, non-member first step**, while keeping verified Auth registration and legally separate membership review as a later step. The `coop_status` API includes `maker_interest_records` as an **interest record count** separate from application and member counts. This does not indicate unique people, paid customers or statutory members, and the publicly accessible view does not include PII. Both EN/DE paths are in the GitHub Pages root sitemap. Google indexing, search traffic and conversions are not yet verified.

Identity sign-up redirect allow-list, confirmation email delivery, new Auth account verification and a real end-to-end applicant admission remain **untested** because there are no Auth users and fabricated test customers are prohibited. Never claim this step passed without an actual consenting maker and confirmed legal/privacy prerequisites. Candidate details remain in privileged server-side records; there is no public listing of submissions.

### No fabricated results
On initial rollout: 0 active participants; 0 cooperative applications; 0 proposals; 0 ballots; 0 income ledger entries; 0 approved distribution policies. The preexisting Atlas store contained 1 unverified maker and 2 review-stage products; these were not promoted into the cooperative or the buyable catalog.

### Admission and operational controls
1. User creates an email-verified Auth account, accepts the processing notice, applies. Applicant status is *not legal cooperative membership*.
2. A human independently validates producer identity and `aa_makers.verification_status='verified'`. The operator binds the maker, a unique reviewed-person reference, a written evidence reference and approval timestamp before setting cooperative pilot status active. The existing platform has no automatic approval route.
3. After at least 3 genuine active vetted participants, a motion may be independently released with dates. Each verified person can vote once; no replay/duplicate votes.
4. A proposal can close after its voting window. Approved fee rules additionally require a majority of yes over no, at least 3 ballots, and written agreements.
5. Treasury insertions are intentionally blocked until a trusted *provider readback* verifies real charges and authorizes the ledger's source of truth. No made-up paid orders or hypothetical revenues are recorded.

### Boundaries still open
Legal cooperative registration, governing articles, membership contracts, a formal Prüfungsverband relationship, merchant tax status, Auth email redirect allow-list testing, full GDPR review, legal terms, payout/KYC/payment-provider integration and anti-spam protection need separate work. Testing database and API is not proof of real users or revenue.

### First commercial proof gate
A genuine **independent** maker signs up, submits consent and documentation, is human-verified, and is activated with the required identity evidence; only then should the first governance motion be considered. No unsolicited invitations are sent.
