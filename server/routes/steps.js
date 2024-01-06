import { Router } from "express";
import multer from "multer";
import {
  createAllTestSteps,
  createNonEuTestSteps,
  createTestSession,
  deleteImage,
  deleteSession,
  fetchOriginalImage,
  fetchSessions,
  getAllSteps,
  getLog,
  updateSession,
  uploadImage,
} from "../controllers/stepsController.js";
import { authenticateToken } from "../helpers/authenticationHelper.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post("/createallteststeps", createAllTestSteps);
router.post("/createnoneuteststeps", createNonEuTestSteps);

router.post("/createtestsession", authenticateToken, createTestSession);

router.put("/updateSession", updateSession);
router.post("/deleteSession", deleteSession);
router.post("/search", fetchSessions);

router.get("/all", getAllSteps);

router.post("/upload-image", upload.single("image"), uploadImage);

router.post("/fetch-original-image", fetchOriginalImage);
router.post("/delete-image", deleteImage);
router.get("/log", getLog);

export default router;
