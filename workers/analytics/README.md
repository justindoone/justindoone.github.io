# Portfolio analytics proxy

Cloudflare Worker that fetches GA4 data on behalf of the `/admin` dashboard.

## Deploy

From this folder:

```bash
# One-time: install wrangler globally
npm install -g wrangler

# One-time: log in to Cloudflare
wrangler login

# One-time: paste the GA4 service account JSON as a secret
wrangler secret put GA_SERVICE_ACCOUNT_JSON
# (it prompts — paste the entire contents of the downloaded JSON key file,
#  then press Ctrl+D / Enter)

# Deploy
wrangler deploy
```

The output ends with a URL like `https://portfolio-analytics.YOUR-SUBDOMAIN.workers.dev`.
That URL is what the admin dashboard fetches from.

## Test

```bash
curl "https://portfolio-analytics.YOUR-SUBDOMAIN.workers.dev?range=7d" \
  -H "Origin: https://justindoone.github.io"
```

Returns a JSON object with `overview`, `timeSeries`, `locations`, `pages`,
`events`, `sources`, `realtime`.

## Update

After edits to `worker.js`:

```bash
wrangler deploy
```

To rotate the service account credentials:

```bash
wrangler secret put GA_SERVICE_ACCOUNT_JSON
wrangler deploy
```
