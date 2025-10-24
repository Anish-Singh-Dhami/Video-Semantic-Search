import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { PassThrough } from "stream";
import { createWriteStream } from "fs";

ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string);

const AUDIO_FREQUENCY_FOR_ASR = 16000;
const AUDIO_FORMAT = "wav";

export type AudioFileType = {
  uuid: string;
  audioFileName: string;
};

/**
 * A promise based method to extra audio from video stream using fluent-ffmpeg with ffmpeg-static binding packages.
 * @param videoStream A Duplex stream allowing the incoming readable stream to pass through as it is to a writable stream,
 * needed for ffmpeg transformation using streams.
 * @returns a promise based string value representing the extracted audio file name.
 */
export const extractAudioFileFromStream = async (
  videoStream: PassThrough
): Promise<AudioFileType> => {
  return new Promise<AudioFileType>((resolve, reject) => {
    const uuid = crypto.randomUUID();
    const audioFileName = uuid + "." + AUDIO_FORMAT;
    ffmpeg(videoStream)
      .audioFrequency(AUDIO_FREQUENCY_FOR_ASR)
      .format(AUDIO_FORMAT)
      .audioChannels(1)
      .noVideo()
      .on("start", (cmd) => {
        console.log("🚀 Started audio extraction using FFmpeg");
      })
      .on("end", () => {
        console.log("✅ FFmpeg processing finished");
        resolve({ uuid, audioFileName });
      })
      .on("error", (err) => {
        console.log("ffmpeg error: ", err);
        reject(err);
      })
      .pipe(createWriteStream(audioFileName));
  });
};
