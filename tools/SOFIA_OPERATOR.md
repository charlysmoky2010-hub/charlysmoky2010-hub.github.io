# SOFIA / TITANIUS — self-running website worker

This worker runs the actual **three MicroVault public landing pages** with Python's standard library and GitHub Actions. It does not call ChatGPT, Claude, model APIs, Stripe, email, browser automation services, or paid design resources.

**Responsibilities:** Check source HTML language, title, meta description, viewport, canonical, heading, parseable JSON-LD, buyer CTA to the existing first-party free CSV scanner, privacy link, keyboard-focus indicators and unsafe new-tab links. The only automatic source edit currently authorized is inserting a visible keyboard-focus CSS rule when absent.

**Execution:**
```sh
python3 -m unittest discover -s tests -p 'test_sofia_site_operator.py' -v
python3 tools/sofia_site_operator.py --mode audit --root . --report /tmp/sofia-audit.json
python3 tools/sofia_site_operator.py --mode fix --root .
```

The workflow `.github/workflows/sofia-site-operator.yml` is scheduled **daily at 04:37 UTC**, and can also be dispatched manually. It operates on the **default branch only**. All modifications are proposed through a **draft pull request** to be reviewed. It never merges, pushes directly to main, changes customer payment links, or publishes user content.

The official GitHub Actions standard Linux runner is free for public repositories, subject to GitHub account and workflow policies. **Other automation services are not installed**. Workflows may be delayed, disabled or denied the permission to create PRs; verify `Actions` in GitHub before asserting a run happened.

A diagnostic pass or static HTML check is NOT proof of visual 10/10, search engine ranking, ad conversions, paid customers, payment or delivery. For full page visual redesign, SOFIA still needs an authorized visual browser/code agent and separate tests. The existing TITANIUS Supabase finance hierarchy remains the commercial authority and independent readback source; this GitHub Action is its isolated website maintenance worker.
