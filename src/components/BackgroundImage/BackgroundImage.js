// Absolute imports
import React, { Component, PropTypes } from 'react'
import config from 'config'

export default class BackgroundImage extends Component {

  render() {

    const combinedStyles = Object.assign({}, this.props.styles, {
      backgroundColor: 'rgba(0,0,0,.075)',
      position: 'relative',
      transition: 'opacity 0.25s',
      opacity: 1,
      backgroundImage: 'url(' + config.img + (this.props.src).split('?')[0] + '?w=' + this.props.maxWidth + ')',
    })

    return (
      <div style={combinedStyles}>

        {/* This is a hidden image node just to hijack browser load events */}
        <img style={{ display: 'none' }} src={this.props.src ? `${config.img}${this.props.src}` : null} onLoad={this.onLoad} alt='placeholder' />

      </div>
    )
  }

}

BackgroundImage.propTypes = {
  maxWidth: PropTypes.number.isRequired,
  src: PropTypes.string,
  styles: PropTypes.object,
}
