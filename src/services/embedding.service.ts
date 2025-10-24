import { cos_sim, pipeline, type DataArray } from "@huggingface/transformers";
import type { Chunk } from "./transcription.service.js";
import type { SegmentPayload, VectorPoint } from "./vector.service.js";

const extractor = await pipeline("feature-extraction");

const generateEmbedding = async (chunkText: string): Promise<DataArray> => {
  const result = await extractor(chunkText, {
    pooling: "mean",
    normalize: true,
  });
  return result.data;
};

/**
 * Generate {@link VectorPoint} from the chunked transcipt using hugging face transformers.js pipeline 
 * feature extraction task.
 * @param chunks {@link Chunk} transcription chunk containing transcribed text along with timestamps.
 * @returns `VectorPoint[]` promisified response containing vector points to be store in the Qdrant vectorDB.
 */
export const generateVectorPoints = async (
  chunks: Chunk[]
): Promise<VectorPoint[]> => {
  console.log("🚀 Started generating vector embeddings...");
  const vectorPoints: VectorPoint[] = [];
  let id = 0;
  for (const chunk of chunks) {
    const vector: number[] = Array.from(await generateEmbedding(chunk.text));
    const timestamp = chunk.timestamp!;
    const text = chunk.text;
    const payload: SegmentPayload = {
      text,
      start_time: timestamp[0],
      end_time: timestamp[1],
    };
    vectorPoints.push({ id, vector, payload });
    id++;
  }
  console.log("🏁 Finished generating vector embeddings");
  return vectorPoints;
};
