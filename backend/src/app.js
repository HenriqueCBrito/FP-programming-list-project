import cors from "cors";
import express from "express";

import { createRateLimiter } from "./middleware/createRateLimiter.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import {
  getCorsOrigins,
  getFeedbackRateLimitMax,
  getFeedbackRateLimitWindowMs,
} from "./utils/config.js";

const app = express();
const feedbackRateLimiter = createRateLimiter({
  windowMs: getFeedbackRateLimitWindowMs(),
  maxRequests: getFeedbackRateLimitMax(),
});

app.use(
  cors({
    origin: getCorsOrigins(),
  }),
);
app.use(express.json());
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.set("Cache-Control", "no-store");
  }

  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/analytics", analyticsRoutes);
app.use("/api/feedback", feedbackRateLimiter, feedbackRoutes);
app.use("/api/ranking", rankingRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "feedback nao encontrado" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.publicMessage || "erro interno ao buscar feedback",
  });
});

export default app;
