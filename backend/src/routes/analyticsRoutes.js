import { Router } from "express";

import {
  getQuestionAnalyticsSummary,
  getStudentLinkForAnalytics,
} from "../controllers/analyticsController.js";
import { requireAnalyticsAccess } from "../middleware/requireAnalyticsAccess.js";

const router = Router();

router.use(requireAnalyticsAccess);
router.get("/questions", getQuestionAnalyticsSummary);
router.get("/student-link", getStudentLinkForAnalytics);

export default router;
