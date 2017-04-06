// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import config from 'config'
import Radium from 'radium'

// Relative imports
import styles from './StaticHero.styles'

@Radium
export default class StaticHero extends Component {

  render() {

    const { actionButton, image, title, subtitle } = this.props

    const heroStyles = Object.assign({}, styles.hero, {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}${image})`,
      '@media (max-width: 1000px)': {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}${image}?w=1000)`,
      },
      '@media (max-width: 600px)': {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}${image}?w=600)`,
      },
    })

    return (
      <div style={heroStyles}>
        <Grid style={styles.heroTextContent}>
          <Row>
            <Col xs={12}>
              <h1>{title}</h1>
              <h5>{subtitle}</h5>
              {actionButton &&
                <div style={styles.btnContainer}>
                  {actionButton}
                </div>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

StaticHero.propTypes = {
  actionButton: PropTypes.element,
  image: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
}
