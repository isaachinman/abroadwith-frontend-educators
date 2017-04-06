// Absolute imports
import React, { PropTypes } from 'react'

// Relative imports
import styles from './FirstInitialCircle.styles'

export default function FirstInitialCircle(props) {

  const { letter, small } = props

  return (
    <div style={small ? Object.assign({}, styles.circle, { width: 40, height: 40, lineHeight: '40px' }) : styles.circle}>{letter}</div>
  )

}

FirstInitialCircle.propTypes = {
  letter: PropTypes.string,
  small: PropTypes.bool,
}
