import { RegisterFileProtocolRequest } from 'electron'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

export const fileHandlers: {
  [key: string]: (
    request: RegisterFileProtocolRequest,
    callback: (filePath: string) => void,
  ) => void
} = {
  ta: (request, callback) => {
    const url = request.url.substr(5)
    callback(path.normalize(`${url}`))
  },
  tav: (request, callback) => {
    const basePath = request.url.substr(6)
    // TODO: locking to prevent too many conversion processes on same files
    if (fs.existsSync(`${basePath}-merged-complete.mp4`)) {
      callback(`${basePath}-merged-complete.mp4`)
    } else {
      ffmpeg()
        .setFfmpegPath(process.env.FFMPEG_PATH!)
        .setFfprobePath(process.env.FFPROBE_PATH!)
        .input(`${basePath}-left_repeater.mp4`)
        .input(`${basePath}-front.mp4`)
        .input(`${basePath}-right_repeater.mp4`)
        .complexFilter([
          '[0:v]scale=320:240[left]',
          '[1:v]scale=640:480[front]',
          '[2:v]scale=320:240[right]',
          '[left][right]hstack[lr]',
          '[front][lr]vstack[output]'
        ], ['output'])
        .videoCodec('libx264')
        .format('mp4')
        .addOption('-movflags frag_keyframe+empty_moov')
        // tslint:disable-next-line: no-console
        .on('error', console.error)
        .on('end', () => {
          fs.linkSync(`${basePath}-merged.mp4`, `${basePath}-merged-complete.mp4`)
          callback(`${basePath}-merged-complete.mp4`)
        })
        .save(`${basePath}-merged.mp4`)
    }
  }
}
