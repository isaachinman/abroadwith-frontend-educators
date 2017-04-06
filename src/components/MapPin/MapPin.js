// Absolute imports
import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

// Styles
const styles = {
  pinContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    left: -15,
    top: -15,
  },
  pin: {
    fontSize: 40,
    color: 'rgba(85, 51, 255, .4)',
  },
}

export default class MapCircle extends Component {

  render() {

    return (
      <div style={styles.pinContainer}>
        <FontAwesome style={styles.pin} name='map-marker' />
      </div>
    )
  }
}
