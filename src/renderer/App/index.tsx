import React, { Component} from 'react'
import { Box, Grommet } from 'grommet'
import TitleBar from '../components/TitleBar'
import './index.less'
import SelectFolder from '../components/SelectFolder'

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
export default class App extends Component<{}, IAppState> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {}
  }

  public render() {
    return (
      <Grommet theme={theme} full>
        <Box fill="vertical" background="dark-1" pad={{ bottom: '40px' }}>
          <TitleBar height="40px" />
          {
            this.state.root ? this.state.root :
            <SelectFolder onSelect={this.setRootFolder.bind(this)}/>
          }
        </Box>
      </Grommet>
    )
  }

  private setRootFolder(root: string) {
    this.setState({
      root
    })
  }
}
