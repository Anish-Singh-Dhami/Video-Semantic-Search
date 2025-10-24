import { Router } from "express";
import { handleVideoUpload } from "../controllers/video.controller.js";

const router = Router();

router.post("/upload-video", handleVideoUpload);

export default router;
