import React, { Component } from 'react'
import Container from '../Container'
import { ScaleLoader } from 'react-spinners'

export default class Loader extends Component {
 public render() {
   return (
    <Container fill>
      <ScaleLoader color="#666" />
    </Container>
   )
 }
}
