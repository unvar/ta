import React, { Component} from 'react'
import { Grommet } from 'grommet'
import TitleBar from '../components/TitleBar'
import './index.less'
import SelectFolder from '../components/SelectFolder'
import VideoGrid from '../components/VideoGrid'
import path from 'path'
import { remote } from 'electron'

const userDataPath = remote.app.getPath('userData')
const appData = path.join(userDataPath, 'ta')

// grommet theme
const theme = {
  global: {
    font: {
      family: 'arial',
      size: '14px',
      height: '20px',
    },
  },
  layer: {
    overlay: {
      background: 'rgb(0, 0, 0, 0.90)'
    }
  }
}

// react state
interface IState {
  root?: string,
}

// react app component
export default class App extends Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {}
  }

  public render() {
    return (
      <Grommet theme={theme} full>
        <TitleBar height="40px" />
        {
          this.state.root ?
          <VideoGrid
            data={appData}
            path={path.join(this.state.root, 'SentryClips')}
          /> :
          <SelectFolder onSelect={this.setRootFolder.bind(this)}/>
        }
      </Grommet>
    )
  }

  private setRootFolder(root: string) {
    this.setState({
      root
    })
  }
}
