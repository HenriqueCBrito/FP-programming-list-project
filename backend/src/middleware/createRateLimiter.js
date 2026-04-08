export function createRateLimiter({ windowMs, maxRequests }) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((entry.resetAt - now) / 1000),
      );

      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        message: "muitas tentativas, tente novamente em instantes",
      });
    }

    entry.count += 1;
    return next();
  };
}
