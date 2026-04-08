import { Router } from "express";

import {
  getAvailableListsByToken,
  getFeedbackByLink,
} from "../controllers/feedbackController.js";

const router = Router();

router.get("/token/:token/lists", getAvailableListsByToken);
router.get("/:listId/:token", getFeedbackByLink);

export default router;
