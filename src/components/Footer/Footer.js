// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Grid } from 'react-bootstrap'
import { Link } from 'react-router'
import moment from 'moment'
import Radium from 'radium'

// Relative imports
import styles from './Footer.styles'

@Radium
export default class Footer extends Component {


  render() {

    const {
      compact,
    } = this.props

    return (
      <footer style={styles.footer}>
        {!compact &&
          <div style={styles.topRow}>
            <Grid>
              <Link to='/terms' style={styles.topLink}>Terms and conditions</Link>
              <Link to='/privacy' style={styles.topLink}>Privacy</Link>
              <a href='//www.abroadwith.com/contact-us' style={styles.topLink}>Contact</a>
              <a href='//www.abroadwith.com/about' style={styles.topLink}>About</a>
            </Grid>
          </div>
        }
        <div style={styles.bottomRow}>
          <Grid style={compact ? styles.compactGrid : {}}>
            &copy; {moment().year()} Abroadwith
          </Grid>
        </div>
      </footer>
    )
  }

}

Footer.propTypes = {
  compact: PropTypes.bool,
  dispatch: PropTypes.func,
}
