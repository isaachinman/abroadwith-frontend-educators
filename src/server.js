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
  // const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoiNlEwb0w1REZhSHNTSG5KLVVuOW4xQSIsImlhdCI6MTQ5MDEwOTUzOSwiZXhwIjoxNDkwNzE0MzM5LCJuYmYiOjE0OTAxMDk0MTksInN1YiI6IlVTRVIiLCJlbWFpbCI6Im4yNTEwODIyQG12cmh0LmNvbSIsIm5hbWUiOiJuMjUxMDgyMkBtdnJodC5jb20iLCJyaWQiOjEwMDYyNiwiY2JrIjozLCJ3aG9zdCI6ZmFsc2V9.Ugi1n629Xjp0-oH_eGelHlSjRQ8VwmF_wQkwQHWwcH9ZnzJDevOX2maTHTiGbykErQrCk3DSUARHvt_f1wCsMquTJawBLPhA2P97HSb8dt2NU47wWbYmgVkfGYnI8O5bOVpmzLE0uQNcJdQdfOqZchnd_MmWhupfVG5IekWvaZYcfWM-URUlrJh2bAL5AVw4wcm5lY5o6DwJ7ATgbc8hXpzNzV8hdqOQRiGCTAP3J_sohqvQSOUTk4t2eQjQfhnXUxA7fqUhmduZL8jvhp9Bv1eL7n8gaOcZl165G5D1AGuXQx8-6QykxexL-LQzazaG_sH0GCu6BenOcnXXvWIFgA'
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

    if (error) {

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
    initProcedure.push(dispatch(loadUserWithAuth(req.cookies.access_token)))

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
