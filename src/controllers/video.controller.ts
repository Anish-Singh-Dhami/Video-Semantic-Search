import { type Request, type Response } from "express";
import { extractAudioFileFromStream } from "../services/extractAudio.service.js";
import { PassThrough } from "stream";
import { transcribeAudioContext } from "../services/transcription.service.js";
import { generateVectorPoints } from "../services/embedding.service.js";
import {
  storeVectorPoints,
  type VectorPoint,
} from "../services/vector.service.js";
import { unlink } from "fs/promises";

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
    if (chunks === undefined) throw new Error("Chunks is undefined");

    const vectorPoints: VectorPoint[] = await generateVectorPoints(chunks);
    await storeVectorPoints(uuid, vectorPoints);
    // unlink the file
    unlink(audioFileName);
    res.json({
      message: "Video is processed and ready for semantic search",
      collectionId: uuid,
    });
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
