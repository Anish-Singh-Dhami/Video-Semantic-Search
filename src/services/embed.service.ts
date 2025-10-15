import axios from "axios";
import type { ChunkType } from "./whisper.servicer.js";

const HF_FEATURE_EXTRACTION_API_URL =
  process.env.HF_FEATURE_EXTRACTION_API_URL!;
const HF_API_KEY = process.env.HF_API_KEY;

export const generateEmbeddings = async (
  segments: ChunkType[]
): Promise<number[][]> => {
  console.log("🚀 Generating embeddings for texts:", segments);

  try {
    const embeddings: number[][] = [];
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
      if(response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log("response : ", response.data);
        embeddings.push(response.data);
      }
    }
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
};
