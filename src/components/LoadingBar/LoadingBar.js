// Absolute imports
import React, { Component, PropTypes } from 'react'
import { babyBlue } from 'styles/colors'
import { connect } from 'react-redux'
import LoadingBar from 'react-redux-loading-bar'

@connect()
export default class Loader extends Component {

  render() {

    return (
      <LoadingBar
        updateTime={50} maxProgress={95} progressIncrease={20}
        style={{ backgroundColor: babyBlue, height: 2, zIndex: 999999 }}
      />
    )
  }
}

Loader.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
}
