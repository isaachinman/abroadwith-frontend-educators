import React, { Component, PropTypes } from 'react'
import Loader from 'react-loader-advanced'
import Spinner from './Spinner'

export default class SpinLoader extends Component {

  render() {

    const { light, noLoader } = this.props
    const backgroundColor = light ? 'rgba(250, 250, 250, 0.45)' : 'rgba(0, 0, 0, 0.25)'

    return (
      <Loader
        contentBlur={1}
        backgroundStyle={{ backgroundColor }}
        show={this.props.show}
        message={!noLoader ? <Spinner delay={500} type='spin' color='#fff' /> : <span />}
      >
        {this.props.children}
      </Loader>

    )
  }
}

SpinLoader.propTypes = {
  children: PropTypes.element,
  light: PropTypes.bool,
  noLoader: PropTypes.bool,
  show: PropTypes.bool,
}
