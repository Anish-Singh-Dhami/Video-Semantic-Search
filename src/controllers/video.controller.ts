import { type Request, type Response } from "express";
import { extractAudio } from "../utils/extractAudio.js";
import { transcribeAudio, type ChunkType, type TranscriptionResponse } from "../services/whisper.servicer.js";
import fs from "fs";
import { generateEmbeddings } from "../services/embed.service.js";

export const handleVideoUpload = async (req: Request, res: Response) => {
  let audioPath = "";
  let videoPath = "";
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const { path, originalname } = req.file;
    videoPath = path;
    console.log(`🎞️ Received video: ${originalname}`);

    // 1️⃣ Extract audio
    audioPath = await extractAudio(videoPath);
    console.log("🎧 Audio extracted:", audioPath);

    // 2️⃣ Send to Whisper
    const transcription: TranscriptionResponse = await transcribeAudio(audioPath);
    console.log("🧠 Transcription complete",);
    const chunks: ChunkType[] = transcription.chunks;

    //4️⃣ Generate embeddings for each chunk
    const vectorEmbeddings : number[][] = await generateEmbeddings(chunks);
    console.log("⚡ Embeddings generated for chunks");

    res.status(200).json({
      videoId: req.file.filename,
      message: "Video uploaded and indexed",
      summary: transcription.text.slice(0, 100)
    });
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    //  Clean up files
    fs.unlinkSync(audioPath);
    fs.unlinkSync(videoPath); // optional cleanup
  }
};
