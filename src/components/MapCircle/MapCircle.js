// Absolute imports
import React, { Component } from 'react'

// Styles
const styles = {
  circle: {
    width: 80,
    height: 80,
    background: 'rgba(85, 51, 255, .15)',
    borderRadius: '50%',
    border: '2px solid rgba(85, 51, 255, .4)',
    position: 'absolute',
    left: -40,
    top: -40,
  },
}

export default class MapCircle extends Component {

  render() {

    return (
      <div style={styles.circle} />
    )
  }
}
