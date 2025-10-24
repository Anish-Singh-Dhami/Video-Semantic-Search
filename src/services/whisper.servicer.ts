import axios from "axios";
import fs from "fs";
import path from "path";

const HF_AUTOMATIC_SPEECH_RECOGNITION_API_URL =
  process.env.HF_AUTOMATIC_SPEECH_RECOGNITION_API_URL!;
const HF_API_KEY = process.env.HF_API_KEY;

export type Chunk = {
  text: string;
  timestamp: [start_time: number, end_time: number];
};

export type TranscriptionResult = {
  text: string;
  chunks?: Chunk[];
};

/**
 * Send audio file to HuggingFace Whisper model for transcription,
 * Having a limitation on the number of requests in free service,
 * going with local deployment using huggingface's transformer.js package for ASR task.
 */

export const transcribeAudio = async (
  audioPath: string
): Promise<TranscriptionResult> => {
  console.log("🚀 Sending audio to Whisper API:", audioPath);
  try {
    const audioFile = fs.readFileSync(audioPath);
    const ext = path.extname(audioPath).toLowerCase();
    const mimeType =
      ext === ".wav"
        ? "audio/wav"
        : ext === ".mp3"
        ? "audio/mpeg"
        : ext === ".flac"
        ? "audio/flac"
        : "audio/mpeg"; // fallback

    const response = await axios.post(
      HF_AUTOMATIC_SPEECH_RECOGNITION_API_URL,
      audioFile,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": mimeType,
          Accept: "application/json",
        },
        responseType: "json",
        params: {
          return_timestamps: true,
        },
      }
    );
    console.log("✅ Transcription received from Whisper API");
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Whisper API error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to transcribe audio");
  }
};
