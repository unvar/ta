# ta (Lao: ຕາ - eyes)

App to view TeslaCam videos

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

### Roadmap
#### Version 1
- ~Download required binaries (ffmpeg, ffprobe)~
- Generate thumbnails on load
- Convert video on click to cache & play the video

#### Version 2
- Stream video directly on click and pipe to cache
- Cache size control

#### Version 3
- Export video to share
