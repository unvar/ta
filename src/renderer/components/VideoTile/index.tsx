import React, { Component } from 'react'
import fs from 'fs'
import path from 'path'
import { Box, Stack } from 'grommet'
import { CirclePlay, Video } from 'grommet-icons'
import { ClipLoader } from 'react-spinners'
import { IVideo } from '../VideoGrid'
import ffmpeg from 'fluent-ffmpeg'

interface IProps {
  path: string
  file: IVideo
  cache: string
  onSelect: (file: string) => void
}

interface IState {
  thumbnail?: string,
  video: boolean,
}

export default class VideoTile extends Component<IProps, IState> {
  constructor(props: Readonly<IProps>) {
    super(props)
    this.state = {
      video: false
    }
  }

  public render() {
    return (
      <Box
        fill
        pad="small"
        margin="small"
        alignContent="center"
        align="center"
        alignSelf="center"
        justify="center"
      >
        <Stack anchor="center">
          {
            this.state.thumbnail ?
            <img width="160" src={`ta://${this.state.thumbnail}`} /> :
            <Stack anchor="center">
              <Video size="160px" color="dark-3"/>
              <ClipLoader color="#666" />
            </Stack>
          }
          <CirclePlay size="large" color="#eaeaea" onClick={this.playVideo.bind(this)} />
        </Stack>
        {this.props.file.label}
      </Box>
    )
  }

  public async componentDidMount() {
    // check for image
    const thumbnailFile = this.props.file.name + '.png'
    const thumbnail = path.join(this.props.cache, thumbnailFile)

    if (!fs.existsSync(thumbnail)) {
      // generate thumbnail
      const thumbnailPath = path.parse(thumbnail)
      ffmpeg()
      .setFfmpegPath(process.env.FFMPEG_PATH!)
      .setFfprobePath(process.env.FFPROBE_PATH!)
      .input(path.join(this.props.path, this.props.file.front))
      // tslint:disable-next-line: no-console
      .on('error', console.error)
      .on('end', () => {
        this.setState({
          thumbnail,
        })
      })
      .thumbnail({
        count: 1,
        filename: thumbnailPath.base,
        folder: thumbnailPath.dir,
        size: '160x160'
      })
    } else {
      this.setState({
        thumbnail,
      })
    }
  }

  private playVideo() {
    this.props.onSelect(this.props.file.name)
  }
}
