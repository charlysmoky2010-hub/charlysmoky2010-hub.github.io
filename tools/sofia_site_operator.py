#!/usr/bin/env python3
"""SOFIA: bounded storefront SEO and keyboard-accessibility maintainer.

Stdlib only; no API keys, LLM tokens, payment writes, or publication.
Only whitelisted local HTML files are read/modified. GitHub Actions opens a
DRAFT PR for any safe fix; it does not merge or deploy that proposal.
"""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

PAGES = {
    'microvault/global/index.html': ('en', 'https://charlysmoky2010-hub.github.io/microvault/global/'),
    'microvault/shop-bestellungen.html': ('de', 'https://charlysmoky2010-hub.github.io/microvault/shop-bestellungen.html'),
    'microvault/order-csv-checker.html': ('en', 'https://charlysmoky2010-hub.github.io/microvault/order-csv-checker.html'),
}
FOCUS_RULE = 'a:focus-visible{outline:3px solid #dba550;outline-offset:3px}'


class Tags(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ''
        self.lang = ''
        self.h1 = False
        self.descriptions = []
        self.canonical = []
        self.viewport = False
        self.links = []
        self.json_ld = []
        self._capture = None
        self._chunks = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html':
            self.lang = a.get('lang', '')
        if tag == 'h1':
            self.h1 = True
        if tag == 'title':
            self._capture = 'title'
            self._chunks = []
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self._capture = 'jsonld'
            self._chunks = []
        if tag == 'meta' and a.get('name', '').lower() == 'description':
            self.descriptions.append(a.get('content', ''))
        if tag == 'meta' and a.get('name', '').lower() == 'viewport':
            self.viewport = True
        if tag == 'link' and a.get('rel', '').lower() == 'canonical':
            self.canonical.append(a.get('href', ''))
        if tag == 'a':
            self.links.append((a.get('href', ''), a.get('class', ''), a.get('target', ''), a.get('rel', '')))

    def handle_data(self, data):
        if self._capture:
            self._chunks.append(data)

    def handle_endtag(self, tag):
        if self._capture == 'title' and tag == 'title':
            self.title = ''.join(self._chunks).strip()
            self._capture = None
        elif self._capture == 'jsonld' and tag == 'script':
            try:
                self.json_ld.append(json.loads(''.join(self._chunks)))
            except json.JSONDecodeError:
                self.json_ld.append(None)
            self._capture = None


def audit_content(content: str, filename: str) -> dict:
    if filename not in PAGES:
        raise ValueError('Refusing non-allowlisted page')
    language, canonical = PAGES[filename]
    doc = Tags()
    doc.feed(content)
    focus = bool(re.search(r'(?:a|\.cta|\.button)(?::focus-visible|[^\n{}]*:focus-visible)\s*\{', content))
    ctas = [h for h, cls, _, _ in doc.links if 'cta' in cls.split() or 'button' in cls.split()]
    direct = any(h.startswith('https://microvault.floot.app/?src=') and h.endswith('#analyzer') for h in ctas)
    unsafe_blank = [(h, rel) for h, _, target, rel in doc.links if target == '_blank' and not {'noopener', 'noreferrer'}.intersection(rel.split())]
    local = urlparse(canonical)
    checks = {
        'correct_locale': doc.lang == language,
        'descriptive_title': len(doc.title) >= 20,
        'meta_description': len(doc.descriptions) == 1 and len(doc.descriptions[0]) >= 60,
        'viewport': doc.viewport,
        'one_correct_canonical': doc.canonical == [canonical],
        'h1': doc.h1,
        'structured_data_parses': bool(doc.json_ld) and all(isinstance(j, (dict, list)) for j in doc.json_ld),
        'direct_free_scan_cta': direct,
        'privacy_notice_link': any('privacy' in h or 'datenschutz' in h for h, _, _, _ in doc.links),
        'visible_keyboard_focus': focus,
        'external_new_tabs_safe': not unsafe_blank,
    }
    return {
        'file': filename, 'origin': local.netloc, 'checks': checks,
        'passed': sum(checks.values()), 'total': len(checks),
        'failed': [k for k, v in checks.items() if not v],
        'money_earned_eur': None,
        'visual_design_score': None,
        'external_browser_tested': False,
    }


def fix_content(content: str, filename: str) -> str:
    if filename not in PAGES:
        raise ValueError('Refusing to modify an unapproved page')
    status = audit_content(content, filename)
    if status['checks']['visible_keyboard_focus']:
        return content
    if content.count('</style>') != 1 or '<style' not in content:
        raise ValueError('Unable to locate a unique existing CSS stylesheet')
    return content.replace('</style>', f'\n{FOCUS_RULE}\n</style>', 1)


def run(mode: str, root: Path, report: Path | None = None) -> dict:
    outputs = []
    for name in PAGES:
        path = root / name
        if not path.resolve().is_relative_to(root.resolve()):
            raise ValueError('Path escapes repository')
        source = path.read_text(encoding='utf-8')
        output = fix_content(source, name) if mode == 'fix' else source
        if output != source:
            path.write_text(output, encoding='utf-8')
        evaluation = audit_content(output, name)
        evaluation['changed_by_sofia'] = output != source
        outputs.append(evaluation)
    result = {'schema': 'titanius.sofia.static_audit.v1', 'mode': mode, 'pages': outputs,
              'safe_patch_count': sum(p['changed_by_sofia'] for p in outputs),
              'model_api_calls': 0, 'checkout_mutations': 0, 'external_messages': 0}
    if report:
        report.parent.mkdir(parents=True, exist_ok=True)
        report.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', required=True, choices=('audit', 'fix'))
    parser.add_argument('--root', type=Path, default=Path('.'))
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    print(json.dumps(run(args.mode, args.root, args.report), indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
