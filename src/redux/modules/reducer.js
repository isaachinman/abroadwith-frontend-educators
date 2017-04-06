// Absolute imports
import { combineReducers } from 'redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { routerReducer } from 'react-router-redux'
import { loadingBarReducer } from 'react-redux-loading-bar'

// Relative imports
import auth from './auth'
import errorHandler from './errorHandler'
import modals from './ui/modals'
import signupStatus from './signup'

export default combineReducers({
  auth,
  errorHandler,
  loadingBar: loadingBarReducer,
  routing: routerReducer,
  reduxAsyncConnect,
  ui: combineReducers({
    modals,
  }),
  signupStatus,
})
