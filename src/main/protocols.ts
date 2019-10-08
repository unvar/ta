import { app, RegisterFileProtocolRequest } from 'electron'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import mkdirp from 'mkdirp'
import LockFile from 'lockfile'

const userDataPath = app.getPath('userData')
const appData = path.join(userDataPath, 'ta')
const cache = path.join(appData, 'cache')
mkdirp.sync(cache)

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
    const name = path.basename(basePath)
    const cachePath = path.join(cache, name)
    const mergedFile = `${cachePath}.mp4`
    const lockFile = `${cachePath}.lock`

    if (fs.existsSync(mergedFile)) {
      LockFile.unlockSync(lockFile)
      callback(mergedFile)
    } else {
      LockFile.lock(lockFile, (err) => {
        if (err) {
          // tslint:disable-next-line: no-console
          console.error(err)
          if (fs.existsSync(mergedFile)) {
            LockFile.unlockSync(lockFile)
            callback(mergedFile)
          }
        } else {
          if (fs.existsSync(mergedFile)) {
            LockFile.unlockSync(lockFile)
            callback(mergedFile)
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
            .on('error', (error) => {
              // tslint:disable-next-line: no-console
              console.error(error)
              LockFile.unlockSync(lockFile)
            })
            .on('end', () => {
              fs.linkSync(`${cachePath}.conv.mp4`, mergedFile)
              LockFile.unlockSync(lockFile)
              callback(mergedFile)
            })
            .save(`${cachePath}.conv.mp4`)
          }
        }
      })
    }
  }
}
