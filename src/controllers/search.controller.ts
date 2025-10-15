import { type Request, type Response } from "express";

export const handleSearch = async (req: Request, res: Response) => {
  try {
    const { query, videoId } = req.query;
    if (!query || !videoId) {
      return res.status(400).json({ error: "Missing query or videoId parameter" });
    }

    // Dummy response for now
    return res.status(200).json({
      query,
      videoId,
      results: [
        {
          startTime: 15.3,
          endTime: 25.6,
          text: "Sample matched transcript chunk.",
          score: 0.87,
        },
      ],
    });
  } catch (error: any) {
    console.error("Search Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
