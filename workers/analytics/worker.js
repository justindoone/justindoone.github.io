/**
 * Portfolio analytics proxy — Cloudflare Worker
 *
 * Signs JWTs with the GA4 service account, exchanges them for access
 * tokens, calls the GA4 Data API for a handful of reports, returns the
 * aggregated JSON to the admin dashboard.
 *
 * Required env (set via `wrangler secret put` or Cloudflare dashboard):
 *   GA_SERVICE_ACCOUNT_JSON — full JSON contents of the service account key
 *
 * Optional vars (set via wrangler.toml [vars] block):
 *   GA_PROPERTY_ID — the GA4 property ID (defaults to 538201658)
 *   ALLOWED_ORIGIN — CORS origin (defaults to https://justindoone.github.io)
 */

const DEFAULT_PROPERTY_ID = '538201658';
const DEFAULT_ORIGIN = 'https://justindoone.github.io';

// ----------------------------------------------------------------------------
// JWT signing + token exchange
// ----------------------------------------------------------------------------

function b64url(input) {
  const str = typeof input === 'string' ? input : String.fromCharCode(...new Uint8Array(input));
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));
  const unsigned = `${header}.${claim}`;

  // Import the PKCS#8 private key for RS256 signing
  const pem = serviceAccount.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const keyBytes = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsigned)
  );
  const jwt = `${unsigned}.${b64url(signature)}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Token exchange failed: ${tokenRes.status} ${err}`);
  }

  const json = await tokenRes.json();
  return json.access_token;
}

// ----------------------------------------------------------------------------
// GA4 Data API calls
// ----------------------------------------------------------------------------

async function ga4Report(propertyId, accessToken, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    throw new Error(`GA4 report failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function ga4RealtimeReport(propertyId, accessToken, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    throw new Error(`GA4 realtime failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// ----------------------------------------------------------------------------
// Dashboard payload assembly
// ----------------------------------------------------------------------------

const RANGE_TO_START = {
  '7d': '7daysAgo',
  '30d': '30daysAgo',
  '90d': '90daysAgo',
};

async function buildDashboard(env, range) {
  const propertyId = env.GA_PROPERTY_ID || DEFAULT_PROPERTY_ID;
  const startDate = RANGE_TO_START[range] || RANGE_TO_START['7d'];
  const dateRanges = [{ startDate, endDate: 'today' }];

  const sa = JSON.parse(env.GA_SERVICE_ACCOUNT_JSON);
  const token = await getAccessToken(sa);

  const [overview, timeSeries, locations, pages, events, sources, recent, realtime] =
    await Promise.all([
      // KPIs: visitors, pageviews, avg session, paid-vs-organic-ish summary
      ga4Report(propertyId, token, {
        dateRanges,
        metrics: [
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'sessions' },
        ],
      }),
      // Daily visitors for the time series chart
      ga4Report(propertyId, token, {
        dateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
      // Top locations
      ga4Report(propertyId, token, {
        dateRanges,
        dimensions: [{ name: 'country' }, { name: 'region' }, { name: 'city' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [
          { metric: { metricName: 'totalUsers' }, desc: true },
        ],
        limit: 10,
      }),
      // Top pages
      ga4Report(propertyId, token, {
        dateRanges,
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [
          { metric: { metricName: 'screenPageViews' }, desc: true },
        ],
        limit: 10,
      }),
      // Top events (case_click, contact_click, case_read, filter_use)
      ga4Report(propertyId, token, {
        dateRanges,
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [
          { metric: { metricName: 'eventCount' }, desc: true },
        ],
        limit: 15,
      }),
      // Top traffic sources
      ga4Report(propertyId, token, {
        dateRanges,
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),
      // Recent activity log: chronological feed of recent pageviews
      // (GA4 doesn't expose per-user session data via the Data API, so this
      // is per-pageview grouped by minute + location + page + source.)
      ga4Report(propertyId, token, {
        dateRanges,
        dimensions: [
          { name: 'dateHourMinute' },
          { name: 'country' },
          { name: 'region' },
          { name: 'city' },
          { name: 'pagePath' },
          { name: 'sessionSource' },
        ],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'dateHourMinute', orderType: 'NUMERIC' }, desc: true }],
        limit: 50,
      }),
      // Live: active users right now (last 30 min)
      ga4RealtimeReport(propertyId, token, {
        metrics: [{ name: 'activeUsers' }],
      }),
    ]);

  return { overview, timeSeries, locations, pages, events, sources, recent, realtime };
}

// ----------------------------------------------------------------------------
// Worker entry
// ----------------------------------------------------------------------------

function corsHeaders(env, origin) {
  const allowed = env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;
  // Allow localhost dev too
  const ok =
    origin === allowed ||
    origin === 'http://localhost:4321' ||
    origin === 'http://127.0.0.1:4321';
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(env, origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    try {
      const url = new URL(request.url);
      const range = url.searchParams.get('range') || '7d';
      const data = await buildDashboard(env, range);
      return new Response(JSON.stringify(data), {
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message || String(err) }),
        { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }
  },
};
