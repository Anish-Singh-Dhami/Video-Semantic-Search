import { Router } from "express";
import multer from "multer";
import { handleVideoUpload } from "../controllers/video.controller.js";

const router = Router();

// multer setup — store uploads locally for now
const upload = multer({ dest: "uploads/" });

router.post("/upload-video", upload.single("file"), handleVideoUpload);

export default router;
