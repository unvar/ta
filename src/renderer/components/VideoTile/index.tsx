import React, { Component } from 'react'
// import fs from 'fs'
import { Box, Stack } from 'grommet'
import { CirclePlay, Video } from 'grommet-icons'
import { ClipLoader } from 'react-spinners'

interface IProps {
  path: string
  file: string
}

interface IState {
  screenshot: boolean,
  video: boolean,
}

export default class VideoTile extends Component<IProps, IState> {
  constructor(props: Readonly<IProps>) {
    super(props)
    this.state = {
      screenshot: false,
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
            this.state.screenshot ?
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
    // if present set state
    // else kickoff creation
    // check for video
    // if present set state
    // else kickoff creation
  }
}
