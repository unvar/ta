import React, { Component } from 'react'
import fs from 'fs'
import path from 'path'
import { Grid, ResponsiveContext } from 'grommet'
import ffbinaries from 'ffbinaries'
import VideoTile from '../VideoTile'
import Container from '../Container'
import Loader from '../Loader'
import mkdirp from 'mkdirp'

interface IProps {
  path: string
  data: string
}

interface IState {
  binaries?: {
    ffmpeg: string,
    ffprobe: string,
  },
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
      return <Loader />
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

  public componentDidMount() {
    if (!this.state.binaries) {
      // binary location
      const bin = path.join(this.props.data, 'bin')
      mkdirp.sync(bin)

      // see if we already have the binaries
      const locations = ffbinaries.locateBinariesSync(
        ['ffmpeg', 'ffprobe'],
        {
          paths: [bin],
          ensureExecutable: true,
        }
      )

      // check the results and download if needed
      if (
        !locations.ffmpeg ||
        !locations.ffmpeg.found ||
        !locations.ffprobe ||
        !locations.ffprobe.found
      ) {
        // download the binaries
        ffbinaries.downloadBinaries(
          ['ffmpeg', 'ffprobe'],
          {
            quiet: true,
            destination: bin
          },
          (err) => {
            if (err) {
              // tslint:disable-next-line: no-console
              console.error(err)
              // TODO:
            } else {
              this.setState({
                binaries: {
                  ffmpeg: path.join(bin, 'ffmpeg'),
                  ffprobe: path.join(bin, 'ffprobe')
                },
              })
            }
          }
        )
      } else {
        this.setState({
          binaries: {
            ffmpeg: locations.ffmpeg.path,
            ffprobe: locations.ffprobe.path
          },
        })
      }
    }
  }

  public componentDidUpdate() {
    if (!this.state.loaded) {
      fs.readdir(this.props.path, (err, files) => {
        if (err) {
          // tslint:disable-next-line: no-console
          console.error(err)
          // TODO:
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
