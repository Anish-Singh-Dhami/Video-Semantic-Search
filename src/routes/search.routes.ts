import { Router } from "express";
import multer from "multer";
import { handleSearch } from "../controllers/search.controller.js";

const router = Router();

// multer setup — store uploads locally for now
const upload = multer({ dest: "uploads/" });

router.get("/search", handleSearch);

export default router;
