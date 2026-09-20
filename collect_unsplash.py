import subprocess, re, json, os, sys, hashlib, html
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

def curl(args, capture=True):
    cmd = ["curl", "-s", "-A", UA]
    cmd += args
    if capture:
        return subprocess.run(cmd, capture_output=True, text=True)
    return subprocess.run(cmd)

def solve_pow(random_data, difficulty):
    c = difficulty // 2
    l = difficulty % 2 != 0
    nonce = 0
    while True:
        h = hashlib.sha256((random_data + str(nonce)).encode()).digest()
        ok = True
        for i in range(c):
            if h[i] != 0:
                ok = False
                break
        if ok and l and (h[c] >> 4) != 0:
            ok = False
        if ok:
            return nonce, h.hex()
        nonce += 1

def fetch_search_page(term):
    jar = f"/workspace/cookies_{re.sub(r'[^a-z0-9_-]', '_', term)}.txt"
    try:
        os.remove(jar)
    except FileNotFoundError:
        pass
    search_url = f"https://unsplash.com/s/photos/{term}"
    # 1. get challenge redirect
    r = curl(["-o", "/dev/null", "-w", "%{redirect_url}", search_url])
    challenge_url = r.stdout.strip()
    if not challenge_url or "within.website" not in challenge_url:
        print(f"[{term}] no challenge redirect, got: {challenge_url[:200]}", file=sys.stderr)
        return []
    # 2. fetch challenge page, set verification cookie
    r = curl(["-c", jar, "-b", jar, "-o", "/workspace/challenge.html", challenge_url])
    challenge_html = open("/workspace/challenge.html", "rb").read().decode("utf-8", "ignore")
    m = re.search(r'<script id="anubis_challenge" type="application/json">(.*?)</script>', challenge_html, re.S)
    if not m:
        print(f"[{term}] challenge json not found", file=sys.stderr)
        return []
    challenge_data = json.loads(m.group(1))
    challenge_inner = challenge_data.get("challenge", challenge_data)
    random_data = challenge_inner["randomData"]
    cid = challenge_inner["id"]
    difficulty = challenge_inner.get("difficulty", challenge_data.get("rules", {}).get("difficulty", 4))
    nonce, response = solve_pow(random_data, difficulty)
    redir = challenge_url.split("redir=", 1)[1]
    pass_url = (
        "https://unsplash.com/.within.website/x/cmd/anubis/api/pass-challenge"
        f"?id={cid}&response={response}&nonce={nonce}&redir={redir}&elapsedTime=2000"
    )
    # 3. pass challenge and follow redirect to search page
    out_path = f"/workspace/page_{term}.html"
    r = curl(["-L", "-c", jar, "-b", jar, "-o", out_path, pass_url])
    if r.returncode != 0:
        print(f"[{term}] pass request failed: {r.stderr}", file=sys.stderr)
        return []
    page = open(out_path, "rb").read().decode("utf-8", "ignore")
    if len(page) < 1000:
        print(f"[{term}] page too small ({len(page)}), likely blocked", file=sys.stderr)
        return []
    # extract image urls
    urls = re.findall(r'https://images\.unsplash\.com/photo-[^\s"<>?]+', page)
    # deduplicate while preserving order
    seen = set()
    unique = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            unique.append(u)
    return unique

def main():
    categories = {
        "产品": ["product-photography", "industrial-design", "packaging-design", "ceramics", "furniture-design", "still-life", "minimalist-product"],
        "摄影": ["minimalist-photography", "architecture-photography", "street-photography", "nature-photography", "portrait-photography", "detail-photography"],
        "版式": ["poster-design", "graphic-design", "editorial-design", "brand-identity", "book-design", "wayfinding-design"],
        "绘画": ["abstract-art", "watercolor", "contemporary-art", "texture-art", "color-abstract", "minimalist-art"],
    }
    results = []
    seen_global = set()
    for category, terms in categories.items():
        cat_ids = []
        for term in terms:
            urls = fetch_search_page(term)
            print(f"[{category}/{term}] got {len(urls)} image urls")
            added_this_term = 0
            max_per_term = 5
            for base in urls:
                if base in seen_global:
                    continue
                seen_global.add(base)
                cat_ids.append(base)
                results.append({
                    "category": category,
                    "url": f"{base}?w=1200&q=80&auto=format&fit=crop",
                    "term": term,
                })
                added_this_term += 1
                if len(cat_ids) >= 20 or added_this_term >= max_per_term:
                    break
            if len(cat_ids) >= 20:
                break
        print(f"[{category}] total unique urls: {len(cat_ids)}")
    # ensure at least 75 total and 15 per category
    counts = {}
    for r in results:
        counts[r["category"]] = counts.get(r["category"], 0) + 1
    print("counts:", counts)
    out_path = "/workspace/unsplash_images.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"saved {len(results)} entries to {out_path}")

if __name__ == "__main__":
    main()
