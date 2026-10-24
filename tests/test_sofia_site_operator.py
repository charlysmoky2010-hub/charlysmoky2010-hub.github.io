import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
from sofia_site_operator import audit_content, fix_content, PAGES


def fake(name):
    language, canonical = PAGES[name]
    return f'''<!doctype html><html lang="{language}"><head><title>Buy a tested CSV quality report</title>
<meta name="description" content="Check your CSV for missing cells and exact duplicate rows in your browser before importing into any other tools.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="{canonical}"><style>.cta{{color:red}}</style>
<script type="application/ld+json">{{"@type":"Article"}}</script></head>
<body><h1>CSV quality check</h1><a class="cta" href="https://microvault.floot.app/?src=shop_csv#analyzer">Free check</a>
<a href="https://example.org/privacy">Privacy</a><p>Stripe pay €29</p></body></html>'''


class TestSofia(unittest.TestCase):
    def test_add_focus_only_and_is_idempotent(self):
        for name in PAGES:
            before = fake(name)
            fixed = fix_content(before,name)
            self.assertIn('a:focus-visible', fixed)
            self.assertEqual(fixed,fix_content(fixed,name))
            self.assertTrue(audit_content(fixed,name)['checks']['visible_keyboard_focus'])
            self.assertIn('Stripe pay €29', fixed)
            self.assertIn('https://microvault.floot.app/?src=shop_csv#analyzer', fixed)

    def test_contract_never_treats_html_as_revenue(self):
        row = audit_content(fake('microvault/global/index.html'),'microvault/global/index.html')
        self.assertIsNone(row['money_earned_eur'])
        self.assertIsNone(row['visual_design_score'])
        self.assertFalse(row['external_browser_tested'])

    def test_reject_unapproved_file(self):
        with self.assertRaises(ValueError):
            fix_content(fake('microvault/global/index.html'),'.github/workflows/evil.yaml')

    def test_no_css_no_unsafe_fallback(self):
        data=fake('microvault/global/index.html').replace('<style>.cta{color:red}</style>','')
        with self.assertRaises(ValueError):
            fix_content(data, 'microvault/global/index.html')

    def test_missing_cta_detected(self):
        data = fake('microvault/global/index.html').replace('https://microvault.floot.app/?src=shop_csv#analyzer','https://example.com/')
        self.assertFalse(audit_content(data,'microvault/global/index.html')['checks']['direct_free_scan_cta'])

    def test_bad_jsonld_detected(self):
        data = fake('microvault/global/index.html').replace('{"@type":"Article"}','{not json}')
        self.assertFalse(audit_content(data,'microvault/global/index.html')['checks']['structured_data_parses'])


if __name__=='__main__':
    unittest.main()
