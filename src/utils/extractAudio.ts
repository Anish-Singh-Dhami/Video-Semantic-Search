import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string);

/**
 * Extracts audio track from video file and saves as .wav
 */
export const extractAudio = async (videoPath: string): Promise<string> => {
  const outputPath = path.join("uploads", `${Date.now()}-audio.wav`);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions(["-vn", "-acodec pcm_s16le", "-ar 44100", "-ac 2"])
      .save(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => {
        console.error("❌ Audio extraction error:", err.message);
        reject(err);
      });
  });
};
