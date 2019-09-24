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
  ffmpeg: string
  ffprobe: string
  cache: string
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
          <CirclePlay size="large" color="#eaeaea" />
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
      ffmpeg(path.join(this.props.path, this.props.file.front))
      .on('end', () => {
        this.setState({
          thumbnail,
        })
      })
      .thumbnail({
        count: 1,
        filename: this.props.file.name + '.png',
        folder: this.props.cache,
        size: '160x160'
      })
    } else {
      this.setState({
        thumbnail,
      })
    }
  }
}
