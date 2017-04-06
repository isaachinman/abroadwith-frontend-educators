// Absolute imports
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { persistStore, autoRehydrate } from 'redux-persist'

// Relative imports
import createMiddleware from './middleware/clientMiddleware'

export default function createStore(history, client, data) {

  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history)

  const middleware = [createMiddleware(client), reduxRouterMiddleware]

  let finalCreateStore

  /* eslint-disable */
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools')
    const DevTools = require('../containers/DevTools/DevTools')
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const reducer = require('./modules/reducer')
  let store
  if (__CLIENT__) {
    store = finalCreateStore(reducer, data, autoRehydrate())
    persistStore(store, { blacklist: ['contactUs', 'hoverables', 'ui', 'routing', 'reduxAsyncConnect', 'publicData', 'privateData', __DEVELOPMENT__ ? 'allowAuthRehydration' : 'auth'] })
  } else {
    store = finalCreateStore(reducer, data)
  }


  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'))
    })
  }
  /* eslint-enable */

  return store
}
