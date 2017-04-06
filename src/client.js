// --------------------------------------------------------------------------------
// This is the entry point for the client
// --------------------------------------------------------------------------------

// Absolute imports
import 'babel-polyfill'
import { browserHistory, Router, match } from 'react-router'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect } from 'redux-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import React from 'react'
import ReactDOM from 'react-dom'

// Relative imports
import ApiClient from './helpers/ApiClient'
import createStore from './redux/create'
import getRoutes from './routes'

const client = new ApiClient()
const dest = document.getElementById('content')
const store = createStore(browserHistory, client, window.__data)
const history = syncHistoryWithStore(browserHistory, store)

if (__DEVTOOLS__) {
  window.Perf = require('react-addons-perf') // eslint-disable-line
}

// Bind Google Analytics to history API
history.listen(location => {
  if (typeof window !== 'undefined' && typeof window.ga === 'function') {
    window.ga('set', 'page', location.pathname + location.search)
    window.ga('send', 'pageview')
  }

})

match({ routes: getRoutes(store), history: browserHistory }, (error, redirectLocation, renderProps) => {
  ReactDOM.render(
    <Provider store={store} key='provider'>
      <Router
        {...renderProps}
        render={(props) => <ReduxAsyncConnect {...props} helpers={{ client }} filter={item => !item.deferred} />}
        history={history}
      >
        {getRoutes(store)}
      </Router>
    </Provider>,
    dest
  )
})

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.')
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {

  // DevTools must be required in so as to not include it in production
  const DevTools = require('./containers/DevTools/DevTools') // eslint-disable-line

  window.Perf = require('react-addons-perf') // eslint-disable-line

  match({ routes: getRoutes(store), history: browserHistory }, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
      <Provider store={store} key='provider'>
        <div>
          <Router
            {...renderProps}
            render={(props) => <ReduxAsyncConnect {...props} helpers={{ client }} filter={item => !item.deferred} />}
            history={history}
          >
            {getRoutes(store)}
          </Router>
          <DevTools />
        </div>
      </Provider>,
      dest
    )
  })
}
