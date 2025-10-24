import axios from "axios";
import type { Chunk } from "./transcription.service.js";

const HF_FEATURE_EXTRACTION_API_URL =
  process.env.HF_FEATURE_EXTRACTION_API_URL!;
const HF_API_KEY = process.env.HF_API_KEY;

export type EmbeddingResponse = {
  originalText: string;
  embedding: number[];
};

/**
 * This service is also cloud based, and have similar problems as with cloud based ASR service.
 * Free tier solution has limit over the number of requests.
 */

export const generateEmbeddings = async (
  segments: Chunk[]
): Promise<EmbeddingResponse[]> => {
  console.log("🚀 Generating embeddings for transcript segments");
  try {
    const embeddings: EmbeddingResponse[] = [];
    for (const segment of segments) {
      const response = await axios.post(
        HF_FEATURE_EXTRACTION_API_URL,
        { inputs: segment.text },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        embeddings.push({
          originalText: segment.text,
          embedding: response.data,
        });
      }
    }
    console.log("✅ Embeddings generated successfully");
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
};
