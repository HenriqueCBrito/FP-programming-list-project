function normalizeCsv(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function getPort(defaultPort = 3001) {
  const rawPort = process.env.PORT;
  const parsedPort = Number.parseInt(rawPort || String(defaultPort), 10);

  if (Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort < 65536) {
    return parsedPort;
  }

  return defaultPort;
}

export function getHost(defaultHost = "0.0.0.0") {
  const host = process.env.HOST?.trim();
  return host || defaultHost;
}

export function getCorsOrigins() {
  const rawOrigins = process.env.CORS_ORIGIN?.trim();

  if (!rawOrigins || rawOrigins === "*") {
    return "*";
  }

  const origins = normalizeCsv(rawOrigins);

  return origins.length > 0 ? origins : "*";
}

export function getAnalyticsAccessKey() {
  return process.env.ANALYTICS_ACCESS_KEY?.trim() || "";
}

export function getFeedbackRateLimitMax(defaultMax = 60) {
  return parsePositiveInteger(process.env.FEEDBACK_RATE_LIMIT_MAX) || defaultMax;
}

export function getFeedbackRateLimitWindowMs(defaultWindowMs = 60_000) {
  return (
    parsePositiveInteger(process.env.FEEDBACK_RATE_LIMIT_WINDOW_MS) ||
    defaultWindowMs
  );
}
