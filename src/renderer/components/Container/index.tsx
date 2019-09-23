import React, { Component } from 'react'
import { Box } from 'grommet'

interface IProps {
  fill: boolean
}

export default class Container extends Component<IProps> {
  public render() {
    return (
      <Box
        pad={{ bottom: '40px' }}
        fill={this.props.fill}
        background="dark-1"
        alignContent="center"
        align="center"
        alignSelf="center"
        justify="center"
        style={{ marginTop: '40px' }}
      >
        {this.props.children}
      </Box>
    )
  }
}