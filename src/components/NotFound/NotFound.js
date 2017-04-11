// Absolute imports
import React, { Component } from 'react'
import Helmet from 'react-helmet'


export default class NotFound extends Component {

  render() {
    return (
      <div className='container'>
        <Helmet title='404 (Not Found)' />
        <h1>404 (Not Found)</h1>
      </div>
    )
  }
}

NotFound.propTypes = {
  t: React.PropTypes.func,
}
