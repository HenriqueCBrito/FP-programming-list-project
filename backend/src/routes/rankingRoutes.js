import { Router } from "express";

import { getTopStudents } from "../controllers/rankingController.js";

const router = Router();

router.get("/top-students", getTopStudents);

export default router;
