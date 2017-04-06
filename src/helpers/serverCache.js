import logger from 'helpers/logger'
import UILanguages from 'data/constants/UILanguages'

const mcache = require('memory-cache')


// This is a very simple html cacher -------------------------------------------
// Basically, we cache all public (static) pages, eg all requests without
// an access_token cookie. This prevents the server having to redo
// expensive renderToString computations over and over for no reason.
// More info: goenning.net/2016/02/10/simple-server-side-cache-for-expressjs
// -----------------------------------------------------------------------------

/* eslint-disable */
const cache = () => {
  return (req, res, next) => {

    const route = req.originalUrl || req.url
    let isOnRightLocaleSite = true

    // Only perform any caching/hydration if it's a logged-out page
    if (!req.cookies.access_token) {

      // We need to ensure that users with a language cookie are hitting the right url
      if (typeof req.cookies.ui_language === 'string') {

        if (req.cookies.ui_language === 'en') {

          Object.keys(UILanguages).map(locale => {
            if (route.indexOf(`/${locale}/`) > -1) {
              isOnRightLocaleSite = false
            }
          })

        } else {

          if (route.indexOf(`/${req.cookies.ui_language}`) === -1) {
            isOnRightLocaleSite = false
          }

          Object.keys(UILanguages).map(locale => {
            if (locale !== req.cookies.ui_language && route.indexOf(`/${locale}/`) > -1) {
              isOnRightLocaleSite = false
            }
          })

        }

      }

      // Define keyname
      const key = '__express__' + route
      const cachedBody = mcache.get(key)

      // If the key already exists, send it down
      if (isOnRightLocaleSite && cachedBody) {
        res.send(cachedBody)

        // Use of in-memory cache completely sidesteps the rest of the application, so we need to do logging here
        // Log requests in production to S3 bucket
        const loggedIn = typeof req.cookies.access_token === 'string'
        logger.info({
          type: 'Session initialisation',
          routeRequested: req.originalUrl,
          loggedIn,
          jwt: loggedIn ? jwtDecode(req.cookies.access_token) : null,
        })

        return
      }

      res.sendResponse = res.send

      // If it doesn't, trigger normal response
      res.send = (body) => {

        // If the request was logically correct, store in cache
        if (isOnRightLocaleSite) {
          mcache.put(key, body)
        }

        res.sendResponse(body)

      }
    }

    next()

  }
}
/* eslint-enable */

export default (app) => {

  const routesToCache = []

  // List of routes to be cached
  ;[
    '',
  ].map(route => {

    // Loop through non-English locales
    Object.values(UILanguages).map(lang => routesToCache.push(`${lang.basepath}${route}`))

  })

  routesToCache.map(route => app.get(route, cache(), (req, res, next) => next()))

}
