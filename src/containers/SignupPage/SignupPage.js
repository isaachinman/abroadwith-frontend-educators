import React, { Component, PropTypes } from 'react'
import { Grid } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { SignupForm, StaticHero } from 'components'

export default class SignupPage extends Component {

  render() {
    return (
      <span>
        <Helmet
          title='Signup'
        />
        <StaticHero
          image='/app/hero/hero_about.jpg'
          title='Become an Educator'
          subtitle='Take advantage of our userbase.'
        />
        <Grid>
          <SignupForm />
        </Grid>
      </span>
    )
  }

}

SignupPage.propTypes = {
  signupStatus: PropTypes.object,
}
