import React, { Component } from 'react'
import fs from 'fs'
import { Grid, ResponsiveContext } from 'grommet'
import { ScaleLoader } from 'react-spinners'
import VideoTile from '../VideoTile'
import Container from '../Container'

interface IProps {
  path: string
}

interface IState {
  loaded: boolean,
  files: string[],
}

const columns: { [key: string]: string[]} = {
  small: ['auto', 'auto'],
  medium: ['auto', 'auto', 'auto', 'auto'],
  large: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto']
}

export default class VideoGrid extends Component<IProps, IState> {
  constructor(props: Readonly<IProps>) {
    super(props)
    this.state = {
      loaded: false,
      files: []
    }
  }

  public render() {
    if (!this.state.loaded) {
      return (
        <Container fill>
          <ScaleLoader color="#666" />
        </Container>
      )
    } else {
      return (
        <Container fill={false}>
          <ResponsiveContext.Consumer>
            {(size) => (
            <Grid
              align="center"
              alignContent="center"
              alignSelf="center"
              justify="center"
              justifyContent="center"
              rows="small"
              columns={columns[size]}
              gap="small"
            >
              {this.state.files.map((file) => <VideoTile path={this.props.path} file={file} key={file} />)}
            </Grid>
          )}
          </ResponsiveContext.Consumer>
        </Container>
      )
    }
  }

  public async componentDidMount() {
    if (!this.state.loaded) {
      fs.readdir(this.props.path, (err, files) => {
        if (err) {
          //
        } else {
          this.setState({
            loaded: true,
            files: files.filter((file) => file.endsWith('-front.mp4')).sort()
          })
        }
      })
    }
  }
}
