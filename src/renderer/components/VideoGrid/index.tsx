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
  files?: { [key: string]: IVideo },
  cache?: string
}

export interface IVideo {
  label: string,
  name: string,
  left: string,
  front: string,
  right: string,
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
              {
                Object.keys(this.state.files!).sort().map((file) =>
                <VideoTile
                  path={this.props.path}
                  file={this.state.files![file]}
                  key={file}
                  ffmpeg={this.state.binaries!.ffmpeg}
                  ffprobe={this.state.binaries!.ffprobe}
                  cache={this.state.cache!}
                />)
              }
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
        !locations.ffmpeg || !locations.ffmpeg.found ||
        !locations.ffprobe || !locations.ffprobe.found
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
              this.setBinaries(path.join(bin, 'ffmpeg'), path.join(bin, 'ffprobe'))
            }
          }
        )
      } else {
        this.setBinaries(locations.ffmpeg.path, locations.ffprobe.path)
      }
    }
  }

  public componentDidUpdate() {
    if (!this.state.loaded) {
      // check for cache directory
      const cache = path.join(this.props.data, 'cache')
      mkdirp.sync(cache)

      // read the files in video directory
      fs.readdir(this.props.path, (err, files) => {
        if (err) {
          // tslint:disable-next-line: no-console
          console.error(err)
          // TODO:
        } else {
          const processedFiles = files
            .filter((file) => file.endsWith('-front.mp4'))
            .map((file) => file.replace('-front.mp4', ''))
            .reduce((prev: { [key: string]: IVideo}, file) => {
              prev[file] = {
                label: 'foo',
                name: file,
                left: `${file}-left_repeater.mp4`,
                front: `${file}-front.mp4`,
                right: `${file}-right_repeater.mp4`,
              }
              return prev
            }, {})
          this.setState({
            loaded: true,
            files: processedFiles,
            cache,
          })
        }
      })
    }
  }

  private setBinaries(ffmpeg: string, ffprobe: string) {
    process.env.FFMPEG_PATH = ffmpeg
    process.env.FFPROBE_PATH = ffprobe
    this.setState({
      binaries: {
        ffmpeg,
        ffprobe
      },
    })
  }
}
