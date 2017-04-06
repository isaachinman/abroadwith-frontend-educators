// Absolute imports
import React, { Component } from 'react'
import config from 'config'
import { pulseOpposite } from 'utils/animation'
import Radium from 'radium'

// Relative imports
import styles from './Logo.styles'

// Animation styles
const animation = {
  pulseOpposite: {
    animation: 'x 0.2s',
    animationName: Radium.keyframes(pulseOpposite, 'pulseOpposite'),
  },
}

@Radium
export default class Logo extends Component {

  state = {
    animate: false,
  }

  handleClick = () => {
    this.setState({ animate: true }, () => setTimeout(() => this.setState({ animate: false }), 400)) // Have to reset for multi use
  }

  render() {

    const { componentStyle, size, color } = this.props // eslint-disable-line no-shadow
    const src = color === 'blue' ? `${config.img}/app/logo/abroadwith_logo_blue_v2.png` : ''

    return (
      <span onMouseDown={this.handleClick} style={Object.assign({}, styles.logoContainer, { maxWidth: size }, componentStyle)}>
        <div style={this.state.animate ? animation.pulseOpposite : null}>
          <img src={src} alt='Abroadwith' style={styles.image} />
        </div>
      </span>
    )
  }


}

Logo.propTypes = {
  componentStyle: React.PropTypes.object,
  size: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired,
}
