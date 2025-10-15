import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import videoRoutes from "./routes/video.routes.js";
import searchRoutes from "./routes/search.routes.js";

const app = express();
const PORT = process.env.PORT!;

app.use(express.json());
app.use("/api", videoRoutes);
app.use("/api", searchRoutes);


app.listen(PORT, () => {
  console.log("PORT ", PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is up and running 🚀",
  });
});
