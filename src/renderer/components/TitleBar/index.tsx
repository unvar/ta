import React from 'react'
import { Box } from 'grommet'
import './index.less'

export default (props: { height: string }) => (
  <Box
    fill="horizontal"
    className="titleBar"
    height={props.height}
  />
)
