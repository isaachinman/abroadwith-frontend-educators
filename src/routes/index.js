// Absolute imports
import React from 'react'
import { IndexRoute, Route } from 'react-router'
import { isLoaded as isAuthLoaded } from 'redux/modules/auth'

// Public routes (included in main bundle)
import {
    App,
    Main,
    SignupPage,
  } from 'containers'

export default (store) => {

  // Simple auth check for logged-in pages
  const requireLogin = (nextState, replace) => {

    function checkAuth() {
      if (!store.getState().auth.jwt) {

        // User is not logged in, and will get bounced to homepage
        replace('/')

      }
    }

    if (!isAuthLoaded(store.getState())) {
      checkAuth()
    }

  }

  // --------------------------------------------------------------------------------
  // Lazy loaded routes: some routes should only be loaded if needed
  // The third argument require.ensure takes is the name of the chunk
  // ----------
  // What you will see below is an absolute tonne of boilerplate
  // Unfortunately, it's unavoidable. require and require.ensure must receive
  // string literals, variables won't work. It must be known at compile time
  // without program flow analysis. These getComponent functions only contain
  // the require.ensure statement, so we are stuck writing them all explicitly.
  // --------------------------------------------------------------------------------
  const getSettings = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Settings/Settings'))
    }, 'settings')
  }
  const getTermsAndConditions = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/TermsAndConditions/TermsAndConditions'))
    }, 'terms')
  }
  const getPrivacyPolicy = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/PrivacyPolicy/PrivacyPolicy'))
    }, 'privacy')
  }


  // --------------------------------------------------------------------------------
  // Please keep routes in alphabetical order
  // With the exception of Main, as this is the IndexRoute
  // --------------------------------------------------------------------------------
  return (

    <span>

      <Route
        path='/'
        key='main-route'
        component={App}
        status={200}
      >

        <IndexRoute component={Main} />

        <Route onEnter={requireLogin}>
          <Route path='settings' getComponent={getSettings} />
          {/* Put logged-in routes here */}
          {/* EXAMPLE: <Route path='settings' getComponent={getSettings} /> */}
        </Route>

        <Route path='signup' component={SignupPage} />
        <Route path='terms' getComponent={getTermsAndConditions} />
        <Route path='privacy' getComponent={getPrivacyPolicy} />

      </Route>

      {/* Catchall for unmatched routes, returns 404 */}
      <Route path='*' component={App} status={404} />

    </span>
  )
}
