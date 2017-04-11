import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

@connect(
  state => ({
    educator: state.privateData.educator,
    token: state.auth.token,
  })
)
export default class Settings extends Component {

  render() {

    console.log(this)

    return (
      <div>
        <Helmet
          title='Settings'
        />
        Settings page
      </div>
    )
  }

}

Settings.propTypes = {
  educator: PropTypes.object,
}
