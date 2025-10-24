import { type Request, type Response } from "express";
import {
  generateEmbeddings,
  type EmbeddingResponse,
} from "../services/embed.service.js";
import { searchSimilarVectors } from "../services/vector.service.js";

export const handleSearch = async (req: Request, res: Response) => {
  try {
    const { query, collectionId } = req.query;
    if (!query || !collectionId) {
      return res
        .status(400)
        .json({ error: "Missing query or collectionId parameter" });
    }

    const embedding: EmbeddingResponse[] = await generateEmbeddings([
      { text: query as string },
    ]);
    const result = await searchSimilarVectors(
      collectionId as string,
      embedding[0]?.embedding!
    );
    res
      .status(200)
      .json({ result_payload: result[0]?.payload, score: result[0]?.score });
  } catch (error: any) {
    console.error("Search Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
