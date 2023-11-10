import { Router } from "express";
import multer from "multer";
import {
  createAllTestSteps,
  createTestSession,
  deleteImage,
  deleteSession,
  fetchOriginalImage,
  fetchSessions,
  getAllSteps,
  updateSession,
  uploadImage,
} from "../controllers/stepsController.js";
import { authenticateToken } from "../helpers/authenticationHelper.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post("/createallteststeps", createAllTestSteps);

router.post("/createtestsession", authenticateToken, createTestSession);

router.put("/updateSession", updateSession);
router.post("/deleteSession", deleteSession);
router.post("/search", fetchSessions);

router.get("/all", getAllSteps);

router.post("/upload-image", upload.single("image"), uploadImage);

router.post("/fetch-original-image", fetchOriginalImage);
router.post("/delete-image", deleteImage);

export default router;
