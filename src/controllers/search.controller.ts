import { type Request, type Response } from "express";

import { searchSimilarVectors } from "../services/vector.service.js";
import { generateEmbedding } from "../services/embedding.service.js";
import type { DataArray } from "@huggingface/transformers";

export const handleSearch = async (req: Request, res: Response) => {
  try {
    const { query, collectionId } = req.query;
    if (!query || !collectionId) {
      return res
        .status(400)
        .json({ error: "Missing query or collectionId parameter" });
    }

    const embedding: DataArray = await generateEmbedding(query as string);
    const result: any[] = await searchSimilarVectors(
      collectionId as string,
      Array.from(embedding)
    );
    res
      .status(200)
      .json({ result_payload: result[0]?.payload, score: result[0]?.score });
  } catch (error: any) {
    console.error("Search Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
