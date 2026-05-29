# Apple Pay domain verification — Lockr

Apple Pay only renders as a payment option in the Whop embed once Apple has verified you own `joinlockr.com`. This is a one-time setup. After it's done, the Apple Pay button appears automatically in the embed for buyers on macOS/iOS Safari with a saved card.

---

## Step-by-step

### 1. JT — initiate in Whop dashboard

1. Log in at https://whop.com → switch to the Lockr company.
2. Settings → Payment Methods → **Apple Pay**.
3. **Add a domain** → enter `joinlockr.com`.
4. Whop shows a verification file with a long string of characters. **Copy that content.**

### 2. JT — drop the file content into the repo

Paste the contents Whop gave you into:

```
/public/.well-known/apple-developer-merchantid-domain-association
```

The file must:
- Have **no extension** (not `.txt`, not anything)
- Be served at `https://joinlockr.com/.well-known/apple-developer-merchantid-domain-association` with content-type `text/plain` (Next.js handles this automatically for files in `/public`)
- Be at root of the domain, not under a subpath

> If you'd rather, paste the contents into chat and I'll create the file.

### 3. Deploy

Push the file and let Vercel deploy. Verify the URL is publicly accessible:

```bash
curl -i https://joinlockr.com/.well-known/apple-developer-merchantid-domain-association
```

Should return 200 and the file content. No HTML wrapping, no redirect.

### 4. JT — verify in Whop dashboard

Back in Whop → Settings → Payment Methods → Apple Pay → next to `joinlockr.com` click **Verify Domain**. Whop hits the URL and confirms.

### 5. Test

Open `https://joinlockr.com/checkout?tier=subscription&cadence=monthly` in Safari on Mac/iOS with a saved Apple Pay card. The Apple Pay button should appear in the embed alongside Card / Cash App / Bank transfer.

---

## Notes

- Verification is per-domain, so `joinlockr.com` and `www.joinlockr.com` may both need separate entries depending on which the embed loads under. Start with the bare domain; add `www` if Whop flags it.
- The verification file content is opaque (looks like base64) but doesn't need to be kept secret — it's a public proof of domain ownership, not a credential.
- If Apple Pay still doesn't appear after verification: check Safari devtools, the embed should call `window.ApplePaySession` and either find it (button shows) or not (button hidden, no error).
