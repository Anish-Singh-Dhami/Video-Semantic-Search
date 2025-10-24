import { type Request, type Response } from "express";
import { extractAudioFileFromStream } from "../utils/extractAudio.js";
import { PassThrough } from "stream";
import { transcribeAudioContext } from "../services/transcription.service.js";

/**
 * Accepts a video file, transcribe it, generate the embedding, and stores the embeddings in the vector db.
 */
export const handleVideoUpload = async (req: Request, res: Response) => {
  try {
    const passThroughStream: PassThrough = new PassThrough();
    req.pipe(passThroughStream);
    const { uuid, audioFileName } = await extractAudioFileFromStream(
      passThroughStream
    );
    const { text, chunks } = await transcribeAudioContext(audioFileName);
    // TODO : Generate embeddings for chunks
    res.json({
      message: "finally finised!!",
    });
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
