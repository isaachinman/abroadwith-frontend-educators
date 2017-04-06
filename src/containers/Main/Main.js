// Absolute imports
import React, { Component, PropTypes } from 'react'
import { headerBluePurple } from 'styles/colors'
import { BackgroundColorBlock } from 'components'
import { Col, Grid, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import Radium from 'radium'
import { scrollToTopOfPage } from 'utils/scrolling'

// Relative imports
import styles from './Main.styles'

@connect(state => ({
  jwt: state.auth.jwt,
  token: state.auth.token,
}))

@Radium
export default class Main extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {

    return (
      <div>

        <Helmet
          title='Promote your language courses worldwide'
        />
        <div style={styles.hero}>

          <Grid style={styles.heroTextContent}>
            <Row>
              <Col xs={12}>
                <h1 style={styles.h1}>Abroadwith For Educators</h1>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>Fill your classroom with thousands of international students.</h5>
              </Col>
            </Row>
          </Grid>

        </div>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row style={{ marginBottom: 50 }}>
              <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2} lg={6} lgOffset={3}>
                Rest of page goes here
              </Col>
            </Row>
          </Grid>
          <BackgroundColorBlock color={headerBluePurple} minHeight={300} />
        </div>

      </div>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  token: PropTypes.string,
}
