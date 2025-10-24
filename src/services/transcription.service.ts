import {
  pipeline,
  type AutomaticSpeechRecognitionOutput,
} from "@huggingface/transformers";
import { promises } from "fs";
import wavefile from "wavefile";

/**
 * Creating an instance of pipeline and specifying the task of automatic speech recognition.
 * The pipeline will download and cache the default pretrained model associated with the task.
 * This can take a while, but subsequent calls will be much faster.
 */
const transcriber = await pipeline("automatic-speech-recognition");

/**
 * [IMP_NOTE]: BELOW CODE WON'T RUN AND THROW ERROR!!,
 * [ERROR]: Unable to load audio from path/URL since `AudioContext` is not available in your environment.
 * Instead, audio data should be passed directly to the pipeline/processor.
 * For more information and some example code, see https://huggingface.co/docs/transformers.js/guides/node-audio-processing
 *
 * ```js
 *  const transcribeAudio = async (audioFile: string): Promise<any> => {
 *    const result = await transcriber(audioFile);
 *    return result;
 *  };
 * ```
 */

/**
 * `text`: Transcribed text divided into self-contained chunks with 30sec limit.
 * `timestamp`: Array of time stamp of the chunk 0th index points to start time and 1st index points to end time of the chunk respectively.
 *  end time will be null for last chunk
 */
export type Chunk = {
  text: string;
  timestamp?: [start_time: number, end_time: number];
};

/**
 * `text`: Whole transcription of the audio file.
 * `chunks`: Array of {@link Chunk} type.
 */
export type TranscriptionResult = {
  text: string;
  chunks?: Chunk[];
};

export const transcribeAudioContext = async (
  audioFileName: string
): Promise<TranscriptionResult> => {
  console.log("🚀 starting transcription...");
  /**
   * Since `AudioContext` is not available in our NodeJS environment.
   * Instead, audio data should be passed directly to the pipeline/processor.
   * For more information and some example code, see https://huggingface.co/docs/transformers.js/guides/node-audio-processing
   */
  const audioContextBuffer = await promises.readFile(audioFileName);
  const wav = new wavefile.WaveFile(audioContextBuffer);
  wav.toBitDepth("32f");
  wav.toSampleRate(16000);
  let audioData = wav.getSamples();
  if (Array.isArray(audioData)) {
    if (audioData.length > 1) {
      const SCALING_FACTOR = Math.sqrt(2);
      // Merge channels (into first channel to save memory)
      for (let i = 0; i < audioData[0].length; ++i) {
        audioData[0][i] =
          (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
      }
    }
    audioData = audioData[0];
  }
  try {
    const result: TranscriptionResult = (await transcriber(audioData, {
      chunk_length_s: 30,
      return_timestamps: true,
    })) as AutomaticSpeechRecognitionOutput;
    console.log("🏁 Finished transcription");
    return result;
  } catch (error) {
    console.log("Error while transcription : ", error);
    throw new Error("Error while transcription !!");
  }
};
