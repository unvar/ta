import React, { Component } from 'react'
import fs from 'fs'
import path from 'path'
import { Grid, ResponsiveContext, Box, Layer } from 'grommet'
import ffbinaries from 'ffbinaries'
import VideoTile from '../VideoTile'
import Container from '../Container'
import Loader from '../Loader'
import mkdirp from 'mkdirp'
import moment from 'moment'
import { ipcRenderer } from 'electron'
import poster from './x-opening.gif'

interface IProps {
  path: string
  data: string
}

interface IState {
  loaded: boolean,
  binaries?: boolean,
  files?: { [key: string]: IVideo },
  cache?: string
  selectedVideo?: string
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
              <Box>
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
                      cache={this.state.cache!}
                      onSelect={this.setSelectedVideo.bind(this)}
                    />)
                  }
                </Grid>
                {this.state.selectedVideo && (
                  <Layer
                    onEsc={() => this.setSelectedVideo(undefined)}
                    onClickOutside={() => this.setSelectedVideo(undefined)}
                    responsive
                    animation="slide"
                    animate
                    style={{ background: 'rgb(0, 0, 0, 0.9)' }}
                  >
                    <video
                      width="640" height="720" controls autoPlay
                      poster={poster}
                    >
                      <source src={`tav://${this.props.path}/${this.state.selectedVideo}`} type="video/mp4" />
                    </video>
                  </Layer>
                )}
              </Box>
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
                label: moment(file, 'YYYY-MM-DD_HH-mm-ss').format('ddd, MMM Do, h:mm:ss a'),
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
    ipcRenderer.send('ffmpeg-loaded', ffmpeg)
    ipcRenderer.send('ffprobe-loaded', ffprobe)
    this.setState({
      binaries: true,
    })
  }

  private setSelectedVideo(file?: string) {
    this.setState({
      selectedVideo: file
    })
  }
}
