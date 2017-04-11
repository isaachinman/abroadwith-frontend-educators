/* eslint no-undef: 0 */

// Absolute imports
import { match } from 'react-router'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import createHistory from 'react-router/lib/createMemoryHistory'
import Express from 'express'
import http from 'http'
import httpProxy from 'http-proxy'
import jwtDecode from 'jwt-decode'
import { load as loadAuth } from 'redux/modules/auth'
import { loadEducatorWithAuth } from 'redux/modules/privateData/educator'
import logger from 'helpers/logger'
import path from 'path'
import PrettyError from 'pretty-error'
import React from 'react'
import ReactDOM from 'react-dom/server'
import imageUploadInstaller from 'utils/upload/ImageUploadInstaller'

// Custom API imports
import { errorHandler, logout } from 'helpers/api'

import serverCache from 'helpers/serverCache'

// Relative imports
import ApiClient from './helpers/ApiClient'
import config from './config'
import createStore from './redux/create'
import getRoutes from './routes'
import Html from './helpers/Html'

const targetUrl = config.apiHost
const pretty = new PrettyError()
const app = new Express()
const server = http.createServer(app)
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  changeOrigin: true,
  secure: !(__DEVELOPMENT__),
})

// Use bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// User cookieParser
app.use(cookieParser())

if (process.env.NODE_ENV !== 'development') {
  // Cache public pages into memory
  serverCache(app)
}

if (process.env.NODE_ENV === 'production') {
  // Set cache headers for assets (one month)
  app.get('/dist/*.(js|css)', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000')
    res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString())
    next()
  })
}

// Install custom API endpoints
const customApiEndpoints = [errorHandler, logout]
customApiEndpoints.map(endpoint => {
  endpoint(app)
})

// Install image upload endpoints
imageUploadInstaller(app)

app.use(Express.static(path.join(__dirname, '..', 'build')))

// Proxy to API server
// Not 100% sure if this will see continued use
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl })
})

// Error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {

  let json = {} // eslint-disable-line

  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error)
  }

  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' })
  }

  json.error = 'proxy_error'
  json.reason = error.message

  res.end(JSON.stringify(json))

})

app.use((req, res) => {

  // Uncomment these lines to set a test token
  /* eslint-disable */
  // const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoiRzY2VmxYaDlwQmpfdzRGWGlUbUtzUSIsImlhdCI6MTQ5MTkxNTU1OCwiZXhwIjoxNDkyNTIwMzU4LCJuYmYiOjE0OTE5MTU0MzgsInN1YiI6IkVEVUNBVE9SIiwicmlkIjo3NSwiZXR5cGUiOiJTQ0hPT0wiLCJldW5hbWUiOiJ0ZXN0X3NjaG9vbCIsImVjdXJyIjoiRVVSIiwiZWFwcHIiOnRydWV9.b1aVFOoy-Xt9g3-AFhLvxVwHUV7rhnH736lNRoG8oQJjGUuns8gkER7MvFra342f_rqZG-ODlXmnbbl0Luc-jmxH1OfG-asH17AyrtjQhlNMuEhoB6hu2Z5bVVNRRb4vPcjGRkvyKOxzOtZK2agMCn9q7egmJDlfKK9UTnE4z7UVsDJOnaYqMj-imS81YWVgO1C_36ue4eqf6rxmSCJnDfyNzrykYJfUDEFvcFz8ecCmsENikXcktUSLiTm52mXZGfp_Im2T9IggVNiuf0m4cw1oRFG2fQINqw99ehpl70XzrcObHKq-QuMkqSJbQkgQ-w7w7cWXweSSgh_4fbZLqg'
  // const expiryDate = new Date()
  // expiryDate.setDate(expiryDate.getDate() + 7)
  // res.cookie('access_token', JWT, { maxAge: 604800000, expires: expiryDate })
  /* eslint-enable */

  // Log requests in production to S3 bucket
  const loggedIn = typeof req.cookies.access_token === 'string'
  logger.info({
    type: 'Session initialisation',
    routeRequested: req.originalUrl,
    loggedIn,
    jwt: loggedIn ? jwtDecode(req.cookies.access_token) : null,
  })

  if (__DEVELOPMENT__) {

    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh()

  }

  // Helper middleware
  const client = new ApiClient(req)

  // Create and sync history with store
  const memoryHistory = createHistory(req.originalUrl)
  const store = createStore(memoryHistory, client)
  const history = syncHistoryWithStore(memoryHistory, store)

  // The all-important renderToString for SSR
  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />))
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient()
    return
  }

  const renderFunction = () => match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {

    if (redirectLocation) {

      res.redirect(redirectLocation.pathname + redirectLocation.search)

    } else if (error) {

      console.error('ROUTER ERROR:', pretty.render(error))
      res.status(500)
      hydrateOnClient()

    } else if (renderProps) {

      loadOnServer({ ...renderProps, store, helpers: { client } }).then(() => {

        console.log('about to send html file')

        const component = (
          <Provider store={store} key='provider'>
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        )

        res.status(200)
        global.navigator = { userAgent: req.headers['user-agent'] }
        res.send('<!doctype html>\n' + ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />))

      })

    } else {
      res.status(404).send('Not found')
    }


  })

  // ---------------------------------------------------------------------------------------------
  // This is where we will do all the custom rendering and external calls necessary for
  // app initialisation. If a new action needs to be added, simply push it into the array.
  // ---------------------------------------------------------------------------------------------
  const { dispatch } = store
  const initProcedure = []

  if (req.cookies.access_token) {

    // If user has an access_token cookie, log them in before rendering the page
    store.dispatch(loadAuth(req.cookies.access_token)) // synchronous action
    initProcedure.push(dispatch(loadEducatorWithAuth(req.cookies.access_token)))

  }

  // Finally, render the page
  Promise.all(initProcedure).then(() => renderFunction())


})

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> ✅  %s is running, talking to API at %s.', config.app.title, targetUrl)
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port)
  })
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified')
}
