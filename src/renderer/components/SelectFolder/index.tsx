import { remote } from 'electron'
import React, { Component } from 'react'
import { Box, Heading } from 'grommet'
import { Search } from 'grommet-icons'
import logo from '../../App/icons/256.png'
import Container from '../Container'

// electron api
const { BrowserWindow, dialog } = remote

interface IProps {
  onSelect: (path: string) => void
}

export default class SelectFolder extends Component<IProps> {
  public render() {
    return (
      <Container fill>
        <img width="200" src={logo} />
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
      </Container>
    )
  }

  private selectRootFolder() {
    dialog.showOpenDialog(
      BrowserWindow.getFocusedWindow()!,
      {
        properties: ['openDirectory'],
      },
    )
    .then(({ canceled, filePaths }) => {
      if (!canceled && filePaths && filePaths.length) {
        this.props.onSelect(filePaths[0])
      }
    })
    .catch(() => {
      //
    })
  }
}
