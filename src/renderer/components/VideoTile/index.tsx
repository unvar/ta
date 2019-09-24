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
        border="all"
        round="xsmall"
        alignContent="center"
        align="center"
        alignSelf="center"
        justify="center"
      >
        <Stack anchor="center">
          {
            this.state.thumbnail ?
            <div>screenshot</div> :
            <Video size="120px" color="dark-3"/>
          }
          {
            this.state.video ?
            <CirclePlay size="medium" /> :
            <ClipLoader color="#666" />
          }
        </Stack>
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
