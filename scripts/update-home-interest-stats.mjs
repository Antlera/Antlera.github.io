import crypto from "node:crypto";
import fs from "node:fs/promises";
import https from "node:https";

const outputPath = "assets/json/home_interest_stats.json";
const tokenUrl = "https://oauth2.googleapis.com/token";
const scope = "https://www.googleapis.com/auth/analytics.readonly";

const config = await fs.readFile("_config.yml", "utf8");
const configPropertyId = config.match(/^google_analytics_property_id:\s*"?([0-9]+)"?/m)?.[1];
const propertyId = process.env.GA4_PROPERTY_ID || configPropertyId;
const serviceAccountJson = process.env.GA_SERVICE_ACCOUNT_JSON;
const startDate = process.env.GA_STATS_START_DATE || "2020-01-01";

if (!propertyId) {
  throw new Error("Missing GA4_PROPERTY_ID or google_analytics_property_id in _config.yml");
}

if (!serviceAccountJson) {
  throw new Error("Missing GA_SERVICE_ACCOUNT_JSON");
}

const serviceAccount = JSON.parse(serviceAccountJson);

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function requestJson(url, options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = "";

      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let parsed;
        try {
          parsed = data ? JSON.parse(data) : {};
        } catch (error) {
          reject(new Error(`Invalid JSON response from ${url}: ${error.message}`));
          return;
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`Request to ${url} failed with ${res.statusCode}: ${JSON.stringify(parsed)}`));
          return;
        }

        resolve(parsed);
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function createJwt() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccount.client_email,
    scope,
    aud: tokenUrl,
    exp: now + 3600,
    iat: now,
  };
  const unsignedJwt = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsignedJwt).sign(serviceAccount.private_key);

  return `${unsignedJwt}.${base64url(signature)}`;
}

async function getAccessToken() {
  const assertion = createJwt();
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }).toString();

  const response = await requestJson(
    tokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body,
  );

  return response.access_token;
}

async function runReport(accessToken) {
  const body = JSON.stringify({
    dateRanges: [{ startDate, endDate: "today" }],
    metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        inListFilter: {
          values: ["/", "/index.html"],
        },
      },
    },
  });

  return requestJson(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body,
  );
}

async function runCountryReport(accessToken) {
  const body = JSON.stringify({
    dateRanges: [{ startDate, endDate: "today" }],
    dimensions: [{ name: "country" }],
    metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        inListFilter: {
          values: ["/", "/index.html"],
        },
      },
    },
    orderBys: [
      {
        metric: {
          metricName: "totalUsers",
        },
        desc: true,
      },
    ],
    limit: 8,
  });

  return requestJson(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body,
  );
}

function metricValue(report, index) {
  return report.rows?.reduce((sum, row) => sum + Number(row.metricValues?.[index]?.value || 0), 0) || 0;
}

function countryRows(report) {
  return (
    report.rows?.map((row) => ({
      country: row.dimensionValues?.[0]?.value || "Unknown",
      totalUsers: Number(row.metricValues?.[0]?.value || 0),
      screenPageViews: Number(row.metricValues?.[1]?.value || 0),
    })) || []
  );
}

const accessToken = await getAccessToken();
const report = await runReport(accessToken);
const countryReport = await runCountryReport(accessToken);
const stats = {
  totalUsers: metricValue(report, 0),
  screenPageViews: metricValue(report, 1),
  topCountries: countryRows(countryReport),
  updatedAt: new Date().toISOString(),
  source: "google_analytics",
  startDate,
};

await fs.writeFile(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
console.log(
  `Wrote ${outputPath}: ${stats.totalUsers} total users, ${stats.screenPageViews} page views, ${stats.topCountries.length} countries`,
);
