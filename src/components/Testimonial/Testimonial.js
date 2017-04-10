// Absolute imports
import React, { Component, PropTypes } from 'react'
import config from 'config'
import Radium from 'radium'

// Relative imports
import styles from './Testimonials.styles'

@Radium
export default class Testimonial extends Component {

  render() {

    const { personName, schoolName, image, description } = this.props

    return (
      <div style={styles.panel}>
        <div style={styles.mainInfo}>
          <img src={`${config.img}${image}?w=200`} style={styles.img} alt={personName} />
          <div style={styles.title} className='header-blue'>{personName}</div>
        </div>
        <div style={styles.content}>
          <h5 className='header-green'>{schoolName}</h5>
          <p>"{description}"</p>
        </div>
      </div>
    )
  }

}

Testimonial.propTypes = {
  personName: PropTypes.string,
  schoolName: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
}
