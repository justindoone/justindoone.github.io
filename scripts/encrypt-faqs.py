"""
Encrypt the answer-bearing fields of faqs.json (wrap + schema) using AES-GCM with
a PBKDF2-derived key from the mockup password. Outputs:
  - src/data/faqs-public.json    (slug + title + blurb + image_url + question_titles)
  - src/data/faqs-encrypted.json (per-slug {iv, ciphertext} + KDF metadata)

The plaintext faqs.json stays in the working tree (gitignored). Only the public
+ encrypted files are committed.

Run:  python scripts/encrypt-faqs.py

Stdlib only — no external deps. Uses hashlib.pbkdf2_hmac + ctypes-free pure-Python
AES-GCM via hashlib + ... wait, Python's stdlib doesn't ship AES. We use cryptography.
If cryptography isn't available, fall back to PyCryptodome.
"""
import json, os, sys, base64, hashlib, secrets
from pathlib import Path

# Try cryptography first (more common), then PyCryptodome
AES_BACKEND = None
try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    AES_BACKEND = "cryptography"
except ImportError:
    try:
        from Crypto.Cipher import AES  # PyCryptodome
        AES_BACKEND = "pycryptodome"
    except ImportError:
        print("Neither 'cryptography' nor 'pycryptodome' installed.")
        print("Install one:  pip install cryptography")
        sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"
PLAINTEXT = DATA / "faqs.json"
PUBLIC = DATA / "faqs-public.json"
ENCRYPTED = DATA / "faqs-encrypted.json"
# Mirror copy to public/ so the build serves it at /faqs/data/encrypted.json
PUBLIC_BLOB = ROOT / "public" / "faqs" / "data" / "encrypted.json"

PASSWORD = os.environ.get("FAQ_MOCKUP_PASSWORD", "evolve2026")
PBKDF2_ITERATIONS = 200_000  # OWASP 2023 recommendation for SHA-256

def aes_gcm_encrypt(key: bytes, iv: bytes, plaintext: bytes) -> bytes:
    if AES_BACKEND == "cryptography":
        return AESGCM(key).encrypt(iv, plaintext, None)
    else:
        cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
        ct, tag = cipher.encrypt_and_digest(plaintext)
        return ct + tag  # WebCrypto AES-GCM format = ciphertext || 16-byte tag

def b64(b: bytes) -> str:
    return base64.b64encode(b).decode("ascii")

def main():
    faqs = json.loads(PLAINTEXT.read_text(encoding="utf-8"))
    print(f"Loaded {len(faqs)} topics from {PLAINTEXT.name}")
    print(f"Backend: {AES_BACKEND}, iterations: {PBKDF2_ITERATIONS}")

    salt = secrets.token_bytes(16)
    key = hashlib.pbkdf2_hmac("sha256", PASSWORD.encode("utf-8"), salt, PBKDF2_ITERATIONS, dklen=32)
    print(f"Salt: {b64(salt)}, key derived ({len(key)} bytes)")

    public_topics = []
    encrypted_topics = {}

    for topic in faqs:
        slug = topic["slug"]
        # Public side — safe to commit cleartext
        public_topics.append({
            "slug": slug,
            "title": topic["title"],
            "blurb": topic.get("blurb", ""),
            "image_url": topic.get("image_url"),
            "question_titles": topic.get("questions", []),
            "wp_modified": topic.get("wp_modified"),
        })
        # Encrypted payload — the full answer markup + schema
        payload = json.dumps({
            "wrap": topic.get("wrap", ""),
            "schema": topic.get("schema", ""),
        }, ensure_ascii=False).encode("utf-8")
        iv = secrets.token_bytes(12)  # 96-bit IV for GCM
        ct = aes_gcm_encrypt(key, iv, payload)
        encrypted_topics[slug] = {"iv": b64(iv), "ciphertext": b64(ct)}
        print(f"  {slug}: plaintext={len(payload)} B -> ciphertext={len(ct)} B")

    PUBLIC.write_text(json.dumps(public_topics, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {PUBLIC} ({PUBLIC.stat().st_size} B)")

    encrypted_blob = {
        "version": 1,
        "kdf": {
            "algo": "PBKDF2-HMAC-SHA256",
            "iterations": PBKDF2_ITERATIONS,
            "salt": b64(salt),
            "key_length": 32,
        },
        "cipher": "AES-GCM",
        "topics": encrypted_topics,
    }
    encrypted_text = json.dumps(encrypted_blob, indent=2)
    ENCRYPTED.write_text(encrypted_text, encoding="utf-8")
    print(f"Wrote {ENCRYPTED} ({ENCRYPTED.stat().st_size} B)")
    PUBLIC_BLOB.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_BLOB.write_text(encrypted_text, encoding="utf-8")
    print(f"Wrote {PUBLIC_BLOB} (mirror for /faqs/data/encrypted.json)")

if __name__ == "__main__":
    main()
