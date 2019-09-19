import React, { Component} from 'react'
import { Box, Grommet, Heading } from 'grommet'
import { Search } from 'grommet-icons'
import './app.less'

const theme = {
  global: {
    font: {
      family: 'arial',
      size: '14px',
      height: '20px',
    },
  },
}

class App extends Component {
  public render() {
    return (
      <Grommet theme={theme} full>
        <Box
          align='center'
          alignContent='center'
          alignSelf='center'
          justify='center'
          pad='medium'
          basis='auto'
          fill='vertical'
          background='dark-1'
        >
          <img 
            width='200'
            src='/icons/app/256.png'
          />
          <Box
            align='center'
            alignContent='center'
            alignSelf='center'
            justify='center'
            pad='none'
            margin='none'
          >
            <Search size='large'/>
            <Heading>Select TeslaCam folder</Heading>
          </Box>
        </Box>
      </Grommet>
    )
  }
}

export default App
