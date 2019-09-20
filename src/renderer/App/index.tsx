import React, { Component} from 'react'
import { Box, Grommet, Heading } from 'grommet'
import { Search } from 'grommet-icons'
import { remote } from 'electron'
import TitleBar from '../components/TitleBar'
import './index.less'
import logo from './icons/256.png'

// electron api
const { BrowserWindow, dialog } = remote

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
interface IAppState {
  root?: string,
}

// react app component
class App extends Component<{}, IAppState> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {}
  }

  public render() {
    return (
      <Grommet theme={theme} full>
        <Box fill="vertical" background="dark-1">
          <TitleBar />
          <Box
            align="center"
            alignContent="center"
            alignSelf="center"
            justify="center"
            fill="vertical"
            background="dark-1"
          >
            <img
              width="200"
              src={logo}
            />
            <Box
              align="center"
              alignContent="center"
              alignSelf="center"
              justify="center"
              onClick={this.selectRootFolder.bind(this)}
            >
              <Search size="large"/>
              <Heading>Select TeslaCam folder</Heading>
            </Box>
            {this.state.root}
          </Box>
        </Box>
      </Grommet>
    )
  }

  private setRootFolder(root: string) {
    this.setState({
      root
    })
  }

  private selectRootFolder() {
    dialog.showOpenDialog(
      BrowserWindow.getFocusedWindow()!,
      {
        properties: ['openDirectory'],
      },
      (filePaths?: string[]) => {
        if (filePaths && filePaths.length) {
          this.setRootFolder(filePaths[0])
        }
      }
    )
  }
}

export default App
