"""Parse the additional sub-pages: book, airport-transfer, limousine-service, for-business, rolls-royce."""
import json
import re
from pathlib import Path
from html import unescape

DL = Path("/home/z/my-project/download")

PAGES = {
    "book":            "amharksa_book.json",
    "airport_transfer":"amharksa_airport.json",
    "limousine":       "amharksa_limo.json",
    "for_business":    "amharksa_business.json",
    "rolls_royce":     "amharksa_rolls.json",
}

def html_to_text(html):
    t = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html, flags=re.I)
    t = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", t, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = unescape(t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

for key, fname in PAGES.items():
    print(f"\n{'='*70}\n=== {key.upper()} ({fname})\n{'='*70}")
    raw = json.loads((DL / fname).read_text(encoding="utf-8"))
    inner = raw.get("data", raw)
    title = inner.get("title", "")
    url   = inner.get("url", "")
    html  = inner.get("html", "")
    text  = html_to_text(html)
    print(f"TITLE: {title}")
    print(f"URL  : {url}")
    print(f"HTML length: {len(html)}  |  Text length: {len(text)}")

    # Headings
    headings = re.findall(r'<h([1-6])[^>]*>([\s\S]*?)</h\1>', html, flags=re.I)
    print("\nHEADINGS:")
    for lvl, h in headings[:25]:
        h_clean = re.sub(r"<[^>]+>", "", h).strip()
        h_clean = unescape(h_clean)
        if h_clean:
            print(f"  H{lvl}: {h_clean}")

    # Forms (esp. on /book/)
    forms = re.findall(r'<form[^>]*>([\s\S]*?)</form>', html, flags=re.I)
    if forms:
        print(f"\nFORMS FOUND: {len(forms)}")
        for fi, form in enumerate(forms, 1):
            inputs = re.findall(r'<(input|select|textarea)[^>]*>', form, flags=re.I)
            print(f"  Form #{fi}: {len(inputs)} fields")
            for inp in inputs[:40]:
                # extract attributes
                tag = inp[0]
                full = inp[0] + re.search(rf'<{inp[0]}([^>]*)>', form).group(1)
                name_m = re.search(r'name=["\']([^"\']+)["\']', full)
                type_m = re.search(r'type=["\']([^"\']+)["\']', full)
                ph_m   = re.search(r'placeholder=["\']([^"\']+)["\']', full)
                req    = 'required' in full.lower()
                lbl_m  = re.search(r'<label[^>]*>([\s\S]*?)</label>', form)
                name = name_m.group(1) if name_m else ""
                typ  = type_m.group(1) if type_m else ""
                ph   = ph_m.group(1) if ph_m else ""
                print(f"    <{tag}> name={name!r:30} type={typ:10} placeholder={ph!r:30} required={req}")

    # Buttons
    buttons = re.findall(r'<button[^>]*>([\s\S]*?)</button>', html, flags=re.I)
    if buttons:
        print(f"\nBUTTONS ({len(buttons)}):")
        for b in buttons[:10]:
            bc = re.sub(r"<[^>]+>", "", b).strip()
            bc = unescape(bc)
            if bc:
                print(f"  - {bc}")

    # Payment hints
    print("\nPAYMENT / INTEGRATION HINTS:")
    pay_hints = []
    for hint, label in [
        ("stripe", "Stripe"), ("paypal", "PayPal"), ("razorpay", "Razorpay"),
        ("paymob", "Paymob"), ("tap.company", "Tap (Mada)"),
        ("hyperpay", "HyperPay"), ("moyasar", "Moyasar"),
        ("checkout.com", "Checkout.com"), ("2checkout", "2Checkout"),
        ("sabb", "SABB"), ("alrajhi", "Al Rajhi"),
        ("mada", "Mada"), ("apple-pay", "Apple Pay"),
        ("stripe.js", "Stripe.js"), ("recaptcha", "reCAPTCHA"),
        ("google recaptcha", "reCAPTCHA"),
        ("gtag", "Google Analytics"), ("fbq", "Facebook Pixel"),
        ("whatsapp", "WhatsApp"), ("wa.me", "WhatsApp link"),
        ("formspree", "Formspree"), ("formsubmit", "FormSubmit"),
        ("getform", "Getform"), ("netlify", "Netlify Forms"),
        ("mailto", "Email submission"),
    ]:
        if hint.lower() in html.lower():
            pay_hints.append(label)
    print("  " + ", ".join(pay_hints) if pay_hints else "  None detected explicitly")

    # Body text preview
    print(f"\nTEXT PREVIEW (first 2500 chars):\n{text[:2500]}")
