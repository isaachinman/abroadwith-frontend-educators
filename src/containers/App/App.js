// Absolute imports
import { connect } from 'react-redux'
import config from 'config'
import FadeProps from 'fade-props'
import { Footer, LoadingBar, Navbar } from 'components'
import { loadEducatorWithAuth } from 'redux/modules/privateData/educator'
import { logout } from 'redux/modules/auth'
import { push } from 'react-router-redux'
import { StyleRoot } from 'radium'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import NotFound from 'components/NotFound/NotFound'
import notification from 'antd/lib/notification'

// Relative imports
import styles from './App.styles'

// Config for notification system
notification.config({ top: 100 })

@connect(
  state => ({
    educator: state.privateData.educator,
    footer: state.ui.footer,
    jwt: state.auth.jwt,
    token: state.auth.token,
    routing: state.routing.locationBeforeTransitions,
    logout,
    pushState: push,
  })
)
export default class App extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  // -------------------------------------------------------------------/
  //   Note that componentDidMount doesn't call on the server
  //   So these requests will specifically wait to fire on the client,
  //   reducing http request load and other computation on the server
  // ------------------------------------------------------------------/
  componentDidMount = () => {

    const { educator, dispatch, token } = this.props

    // If auth is present and educator is not loaded, load it now
    if (!educator.loaded && typeof token === 'string') {
      dispatch(loadEducatorWithAuth(token))
    }

  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render() {

    const { children, jwt, route } = this.props

    return (
      <StyleRoot>
        <div style={styles.appContainer}>

          <Helmet {...config.app.head} />

          <LoadingBar />
          <Navbar jwt={jwt} user={null} title={config.app.title} />

          <FadeProps animationLength={80}>
            <main style={styles.appContent} key={children ? children.type.displayName : '404'}>
              {route.status === 200 && children}
              {route.status === 404 && <NotFound />}
            </main>
          </FadeProps>

          <Footer />

        </div>
      </StyleRoot>
    )
  }
}

App.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  educator: PropTypes.object,
  footer: PropTypes.object,
  jwt: PropTypes.object,
  pushState: PropTypes.func,
  route: PropTypes.object,
  router: PropTypes.object,
  routing: PropTypes.object,
  logout: PropTypes.func,
  token: PropTypes.string,
}
