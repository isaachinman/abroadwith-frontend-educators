// Imports
import React, { Component, PropTypes } from 'react'

// Styles
const styles = {
  baseStyle: {
    zIndex: -1,
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
  },
}

export default class BackgroundColorBlock extends Component {

  render() {
    const { color, minHeight, zIndex, style, top } = this.props

    let baseStyle = zIndex ? Object.assign({}, styles.baseStyle, { zIndex }) : Object.assign({}, styles.baseStyle)

    if (top) {
      baseStyle.top = 0
      baseStyle.bottom = 'auto'
    }

    if (style) {
      baseStyle = Object.assign({}, baseStyle, style)
    }

    return (
      <div style={Object.assign({}, baseStyle, { background: color, minHeight })} />
    )
  }

}

BackgroundColorBlock.propTypes = {
  color: PropTypes.string.isRequired,
  minHeight: PropTypes.number.isRequired,
  style: PropTypes.object,
  top: PropTypes.bool,
  zIndex: PropTypes.number,
}
