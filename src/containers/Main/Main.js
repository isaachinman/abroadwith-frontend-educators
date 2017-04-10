// Absolute imports
import React, { Component, PropTypes } from 'react'
import { babyBlue, freshGreen } from 'styles/colors'
import { BackgroundColorBlock, Testimonial } from 'components'
import { Button, Col, Grid, Panel, Row } from 'react-bootstrap'
import config from 'config'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
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
                <h5>Fill your classroom with thousands of international students.</h5>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Link to='/signup'>
                  <Button bsStyle='success'>Sign up</Button>
                </Link>
              </Col>
            </Row>
          </Grid>

        </div>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row>
              <Col xs={12}>
                <h3 style={styles.centerAlign}>How does it work?</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={4}>
                <Panel>
                  <img src={`${config.img}/educators/app/steps/register.png`} alt='Register' style={styles.stepImg} />
                  <h6 style={styles.stepTitle}>1. Register as a school or tutor.</h6>
                </Panel>
              </Col>
              <Col xs={12} sm={4}>
                <Panel>
                  <img src={`${config.img}/educators/app/steps/manage.png`} alt='Manage' style={styles.stepImg} />
                  <h6 style={styles.stepTitle}>2. Add and manage your courses on the platform.</h6>
                </Panel>
              </Col>
              <Col xs={12} sm={4}>
                <Panel>
                  <img src={`${config.img}/educators/app/steps/receive.png`} alt='Receive' style={styles.stepImg} />
                  <h6 style={styles.stepTitle}>3. Receive student bookings worldwide.</h6>
                </Panel>
              </Col>
            </Row>
          </Grid>
          <BackgroundColorBlock color={freshGreen} minHeight={260} />
        </div>

        <Grid style={styles.paddedGrid}>
          <Row>
            <Col xs={12}>
              <h3 style={styles.centerAlign}>Abroadwith for Educators - FAQ</h3>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <p className='lead'>What is Abroadwith?</p>
              <p>
                Abroadwith.com is an innovative platform that allows students to book their ideal language immersion program, selecting a homestay and a language course of their choice.
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <p className='lead'>What is Abroadwith for Educators?</p>
              <p>
                The Abroadwith Educators’ Platform puts you in front of thousands of language students already coming to your city and looking for a language course. It’s a simple place to publish and offer your language courses in real-time, as well as track bookings and profits.
                It’s user-friendly and best of all, free.
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <p className='lead'>How does it work?</p>
              <p>
                After <Link to='/signup'>signing up here</Link>, our Account managers will contact you in order to approve your account. After that, you will be ready to publish language courses and get booked by thousands of students coming to your city.
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <p className='lead'>How are transactions handled?</p>
              <p>
                Courses are booked on the platform and paid by Abroadwith during the first week of the course via bank transfer or PayPal. Abroadwith keeps a standard commission from every transaction.
              </p>
            </Col>
          </Row>
        </Grid>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row>
              <Col xs={12}>
                <h3 style={styles.centerAlign}>Testimonials</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Testimonial
                  personName='Alba'
                  schoolName='Universidad de Granada, Spain'
                  image='/app/testimonials/alba.jpg'
                  description='Abroadwith has helped many of our students find summer language programs and homestays abroad during their Erasmus exchanges. Often times planning student accommodations can be a complicated process, especially during the busy season at our international office.
                    However, using Abroadwith to help our students search and book local hosts has proven to be a timesaver and very successful.
                    Our students always come back raving about their once-in-a-lifetime experiences upon their return.'
                />
              </Col>
            </Row>
          </Grid>
          <div style={{ paddingTop: 50, marginBottom: -20 }} />
          <BackgroundColorBlock color={babyBlue} minHeight={240} />
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
