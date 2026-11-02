"""
Comprehensive Test Suite for Simon Munyambu's Portfolio Website.
Verifies DOM structure, WCAG accessibility invariants, command palette contracts,
terminal emulator command registry, and CSS design tokens.
"""

import os
import re
import unittest

PORTFOLIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
HTML_PATH = os.path.join(PORTFOLIO_DIR, "index.html")
CSS_PATH = os.path.join(PORTFOLIO_DIR, "styles.css")
JS_PATH = os.path.join(PORTFOLIO_DIR, "app.js")


class TestPortfolioWebsite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(HTML_PATH, "r", encoding="utf-8") as f:
            cls.html = f.read()
        with open(CSS_PATH, "r", encoding="utf-8") as f:
            cls.css = f.read()
        with open(JS_PATH, "r", encoding="utf-8") as f:
            cls.js = f.read()

    def test_html_structure_and_doctype(self):
        """Verify strict HTML5 doctype, language, and viewport metadata."""
        self.assertTrue(self.html.startswith("<!DOCTYPE html>") or "<!DOCTYPE html>" in self.html[:50])
        self.assertIn('<html lang="en"', self.html)
        self.assertIn('<meta name="viewport"', self.html)
        self.assertIn('content="width=device-width, initial-scale=1.0"', self.html)

    def test_seo_and_open_graph_metadata(self):
        """Verify SEO metadata and Open Graph tags for Simon Munyambu."""
        self.assertIn("<title>Simon Munyambu | Software & AI/ML Systems Engineer</title>", self.html)
        self.assertIn('name="description"', self.html)
        self.assertIn('property="og:title"', self.html)
        self.assertIn('property="og:description"', self.html)
        self.assertIn('name="author" content="Simon Munyambu"', self.html)

    def test_semantic_sections(self):
        """Verify all major semantic sections exist for full skills portfolio."""
        sections = [
            'id="hero"',
            'id="skills"',
            'id="projects"',
            'id="terminal"',
            'id="architecture"',
            'id="experience"',
            'id="contact"',
        ]
        for sec in sections:
            with self.subTest(section=sec):
                self.assertIn(sec, self.html, f"Section {sec} missing from DOM")

    def test_skills_matrix_coverage(self):
        """Ensure all required domains are represented in the skills matrix."""
        required_domains = [
            "Systems & Kernel Engineering",
            "AI / Machine Learning",
            "Distributed Systems & Backend",
            "Frontend & Design Engineering",
        ]
        for domain in required_domains:
            with self.subTest(domain=domain):
                self.assertIn(domain, self.html, f"Domain '{domain}' missing from skills matrix")

    def test_key_technologies_present(self):
        """Ensure Simon's core technical stack keywords appear in the portfolio."""
        tech_keywords = [
            "C/C++", "Rust", "Go", "Python",
            "PyTorch", "Linux Kernel", "SQLite WAL", "AsyncIO",
            "TypeScript", "CUDA", "eBPF", "Docker"
        ]
        for tech in tech_keywords:
            with self.subTest(tech=tech):
                self.assertIn(tech, self.html, f"Tech keyword '{tech}' not found")

    def test_celestial_lion_canvas_and_branding(self):
        """Verify lion motif canvas element and pride of Kenya branding."""
        self.assertIn('id="constellationCanvas"', self.html)
        self.assertIn('lion', self.html.lower())

    def test_interactive_terminal_structure(self):
        """Verify embedded terminal emulator elements and controls."""
        self.assertIn('id="terminalWindow"', self.html)
        self.assertIn('id="termInput"', self.html)
        self.assertIn('id="termOutput"', self.html)

    def test_command_palette_cmdk_contract(self):
        """Verify Paco Coursey cmdk command palette modal and shortcut indicators."""
        self.assertIn('id="cmdkModal"', self.html)
        self.assertIn('id="cmdkInput"', self.html)
        self.assertIn('id="cmdkList"', self.html)
        self.assertIn('⌘K', self.html)

    def test_slide_over_drawer_contract(self):
        """Verify slide-over architecture detail drawer exists."""
        self.assertIn('id="archDrawer"', self.html)
        self.assertIn('id="drawerOverlay"', self.html)
        self.assertIn('id="drawerTitle"', self.html)
        self.assertIn('id="drawerContent"', self.html)

    def test_css_tokens_and_anti_slop(self):
        """Verify zinc tokens, font variables, and Emil Kowalski transitions."""
        self.assertIn("--bg-base: #09090b", self.css)
        self.assertIn("--card-bg: #121215", self.css)
        self.assertIn("--border-subtle: #27272a", self.css)
        self.assertIn("--sky: #38bdf8", self.css)
        self.assertIn("--indigo: #818cf8", self.css)
        self.assertIn("cubic-bezier(0.16, 1, 0.3, 1)", self.css)

    def test_responsive_media_queries(self):
        """Verify responsive breakpoints down to mobile (768px and 480px)."""
        self.assertIn("@media (max-width: 1024px)", self.css)
        self.assertIn("@media (max-width: 768px)", self.css)
        self.assertIn("@media (max-width: 480px)", self.css)

    def test_js_terminal_commands_registry(self):
        """Verify JavaScript implements essential shell commands."""
        expected_commands = ["help", "skills", "projects", "bio", "bench", "contact", "clear"]
        for cmd in expected_commands:
            with self.subTest(command=cmd):
                self.assertIn(f"'{cmd}'", self.js, f"Command '{cmd}' not registered in terminal commands")

    def test_js_keyboard_shortcuts(self):
        """Verify Cmd+K / Ctrl+K and Escape listeners in JS."""
        self.assertIn("keydown", self.js)
        self.assertIn("Escape", self.js)
        self.assertIn("KeyK", self.js)

    def test_external_links_security(self):
        """Ensure external anchor tags specify rel='noopener noreferrer' and target='_blank'."""
        external_links = re.findall(r'<a\s+[^>]*href=["\'](http[s]?://[^"\']+)["\'][^>]*>', self.html)
        self.assertTrue(len(external_links) > 0, "No external links found to test")
        for link in re.finditer(r'<a\s+([^>]*)href=["\'](http[s]?://[^"\']+)["\']([^>]*)>', self.html):
            attrs = link.group(1) + " " + link.group(3)
            self.assertIn('target="_blank"', attrs, f"Link {link.group(2)} missing target='_blank'")
            self.assertIn('rel="noopener', attrs, f"Link {link.group(2)} missing rel='noopener'")


if __name__ == "__main__":
    unittest.main()
