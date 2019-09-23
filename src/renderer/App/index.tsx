import React, { Component} from 'react'
import { Grommet } from 'grommet'
import TitleBar from '../components/TitleBar'
import './index.less'
import SelectFolder from '../components/SelectFolder'
import VideoGrid from '../components/VideoGrid'
import path from 'path'

// grommet theme
const theme = {
  global: {
    font: {
      family: 'arial',
      size: '14px',
      height: '20px',
    },
  },
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
          <VideoGrid path={path.join(this.state.root, 'RecentClips')} /> :
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
