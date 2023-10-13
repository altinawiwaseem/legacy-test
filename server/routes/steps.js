import { Router } from "express";
import {
  createAllTestSteps,
  createTestSession,
  deleteSession,
  fetchSessions,
  getAllSteps,
  updateSession,
} from "../controllers/stepsController.js";
import { authenticateToken } from "../helpers/authenticationHelper.js";

const router = Router();

router.post("/createallteststeps", createAllTestSteps);

router.post("/createtestsession", authenticateToken, createTestSession);

router.put("/updateSession", updateSession);
router.post("/deleteSession", deleteSession);
router.post("/search", fetchSessions);

router.get("/all", getAllSteps);

export default router;
