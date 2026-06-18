"""Parse the page_reader JSON output to extract title, text, links and metadata."""
import json
import re
from pathlib import Path
from html import unescape

src = Path("/home/z/my-project/download/amharksa_home.json")
data = json.loads(src.read_text(encoding="utf-8"))

print("=== TOP-LEVEL KEYS ===")
print(list(data.keys()) if isinstance(data, dict) else type(data))

inner = data.get("data", data) if isinstance(data, dict) else data
print("\n=== INNER KEYS ===")
print(list(inner.keys()) if isinstance(inner, dict) else type(inner))

title = inner.get("title", "")
url = inner.get("url", "")
published = inner.get("publishedTime") or inner.get("publish_time")
html = inner.get("html", "")

print(f"\n=== TITLE ===\n{title}")
print(f"\n=== URL ===\n{url}")
print(f"\n=== PUBLISHED ===\n{published}")
print(f"\n=== HTML LENGTH ===\n{len(html)} chars")

text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html, flags=re.I)
text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", text, flags=re.I)
text = re.sub(r"<[^>]+>", " ", text)
text = unescape(text)
text = re.sub(r"\s+", " ", text).strip()

print(f"\n=== PLAIN TEXT (first 6000 chars) ===\n{text[:6000]}")

links = re.findall(r'href=["\']([^"\']+)["\']', html, flags=re.I)
internal = [l for l in links if l.startswith("/") or "amharksa.com" in l]
external = [l for l in links if l.startswith("http") and "amharksa.com" not in l]

print(f"\n=== LINK COUNTS ===")
print(f"Total: {len(links)}, Internal: {len(internal)}, External: {len(external)}")
print("\nUnique internal links (first 60):")
for l in sorted(set(internal))[:60]:
    print(f"  - {l}")

print("\nUnique external links (first 30):")
for l in sorted(set(external))[:30]:
    print(f"  - {l}")

metas = re.findall(r'<meta[^>]+>', html, flags=re.I)
print(f"\n=== META TAGS ({len(metas)}) ===")
for m in metas[:40]:
    print(m)

imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, flags=re.I)
print(f"\n=== IMAGE COUNT: {len(imgs)} ===")
for i in imgs[:20]:
    print(f"  - {i}")

headings = re.findall(r'<h([1-6])[^>]*>([\s\S]*?)</h\1>', html, flags=re.I)
print(f"\n=== HEADINGS ({len(headings)}) ===")
for level, h in headings[:50]:
    h_clean = re.sub(r"<[^>]+>", "", h).strip()
    h_clean = unescape(h_clean)
    if h_clean:
        print(f"  H{level}: {h_clean}")

print("\n=== TECH HINTS ===")
tech_hints = []
if "wp-content" in html or "wp-includes" in html:
    tech_hints.append("WordPress")
if "shopify" in html.lower():
    tech_hints.append("Shopify")
if "react" in html.lower():
    tech_hints.append("React")
if "vue" in html.lower():
    tech_hints.append("Vue")
if "next.js" in html.lower() or "__next" in html:
    tech_hints.append("Next.js")
if "magento" in html.lower():
    tech_hints.append("Magento")
if "elementor" in html.lower():
    tech_hints.append("Elementor")
if "woocommerce" in html.lower():
    tech_hints.append("WooCommerce")
if "bootstrap" in html.lower():
    tech_hints.append("Bootstrap")
if "tailwind" in html.lower():
    tech_hints.append("Tailwind")
if "google-analytics" in html.lower() or "gtag" in html.lower():
    tech_hints.append("Google Analytics")
if "facebook.net" in html.lower() or "fbq" in html.lower():
    tech_hints.append("Facebook Pixel")
if "cdnjs" in html.lower():
    tech_hints.append("CDNJS")
if "jquery" in html.lower():
    tech_hints.append("jQuery")
if "snapchat" in html.lower():
    tech_hints.append("Snapchat Pixel")
if "tiktok" in html.lower():
    tech_hints.append("TikTok Pixel")
print(", ".join(tech_hints) if tech_hints else "None detected")

out = Path("/home/z/my-project/download/amharksa_text.txt")
out.write_text(text, encoding="utf-8")
print(f"\n=== Plain text saved to {out} ({len(text)} chars) ===")
