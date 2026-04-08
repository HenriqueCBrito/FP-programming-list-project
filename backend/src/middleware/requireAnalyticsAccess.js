import { getAnalyticsAccessKey } from "../utils/config.js";

export function requireAnalyticsAccess(req, res, next) {
  const configuredKey = getAnalyticsAccessKey();

  if (!configuredKey) {
    return res.status(503).json({
      message: "acesso da analise indisponivel",
    });
  }

  const providedKey = req.get("x-analytics-key")?.trim();

  if (!providedKey || providedKey !== configuredKey) {
    return res.status(401).json({
      message: "acesso restrito",
    });
  }

  return next();
}
