// Absolute imports
import { closeLoginModal } from 'redux/modules/ui/modals'
import config from 'config.js'
import jwtDecode from 'jwt-decode'
import { loadEducatorWithAuth } from 'redux/modules/privateData/educator'
import moment from 'moment'
import notification from 'antd/lib/notification'
import { REHYDRATE } from 'redux-persist/constants'
import superagent from 'superagent'

// Load previously stored auth
const LOAD = 'abroadwith-educators/LOAD_AUTH'
const LOAD_SUCCESS = 'abroadwith-educators/LOAD_AUTH_SUCCESS'
const LOAD_FAIL = 'abroadwith-educators/LOAD_AUTH_FAIL'

// Login stuff
const LOGIN = 'abroadwith-educators/LOGIN'
const LOGIN_SUCCESS = 'abroadwith-educators/LOGIN_SUCCESS'
const LOGIN_FAIL = 'abroadwith-educators/LOGIN_FAIL'

// Logout stuff
const LOGOUT = 'abroadwith-educators/LOGOUT'
const LOGOUT_SUCCESS = 'abroadwith-educators/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'abroadwith-educators/LOGOUT_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // This is a rehydration (from localstore) case
    case REHYDRATE: {
      const incoming = action.payload.auth
      if (incoming) return { ...state, ...incoming }
      return state
    }
    case LOAD:
      return {
        ...state,
        loading: true,
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        jwt: jwtDecode(action.jwt),
        token: action.jwt,
        error: false,
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.error,
      }
    case LOGIN:
      return {
        ...state,
        loaded: false,
        loggingIn: true,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loaded: true,
        loggingIn: false,
        jwt: jwtDecode(action.jwt),
        token: action.jwt,
      }
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        error: true,
        errorMessage: action.error,
      }
    case LOGOUT:
      return {
        ...state,
        loggingOut: true,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
        jwt: null,
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        error: true,
        errorMessage: action.error,
      }
    default:
      return state
  }
}

export function isLoaded(globalState) {

  const authIsLoaded = globalState.jwt && globalState.auth && globalState.auth.loaded
  return authIsLoaded

}

// This function is primarily serverside
export function load(jwt) {

  return dispatch => {

    dispatch({ type: LOAD })

    try {

      return new Promise((resolve) => {

        // Ensure validity
        if (moment(jwtDecode(jwt).exp * 1000).isBefore(moment())) {
          resolve(dispatch({ type: LOAD_FAIL, err: 'jwt expired' }))
        } else {
          resolve(dispatch({ type: LOAD_SUCCESS, jwt }))
        }

      })

    } catch (err) {
      dispatch({ type: LOAD_FAIL, err })
    }

  }

}

export function login(userName, password, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: LOGIN })

    try {

      const request = superagent.post(`${config.apiHost}/educators/login`)

      if (userName && password) {
        request.send({
          userName,
          password,
        })
      }

      request.withCredentials()

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: LOGIN_FAIL, err })

        } else if (body && body.token) {

          // Login was successful
          const jwt = body.token
          dispatch({ type: LOGIN_SUCCESS, jwt })

          // Close login modal
          dispatch(closeLoginModal())

          // Load educator object
          dispatch(loadEducatorWithAuth(jwt))

          cb()

        } else {

          dispatch({ type: LOGIN_FAIL, err: 'Unknown error' })

        }

      })

    } catch (err) {
      dispatch({ type: LOGIN_FAIL, err })
    }
  }
}

export function facebookLogin(userName, facebookToken, callback) {
  return async dispatch => {
    dispatch(login(userName, null, facebookToken, null, callback))
  }
}

export function googleLogin(userName, googleToken, callback) {
  return async dispatch => {
    dispatch(login(userName, null, null, googleToken, callback))
  }
}

export function logout() {

  // Clear session data
  localStorage.clear()
  notification.destroy()

  // POST to logout endpoint (removes httpOnly cookie)
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: () => fetch(new Request('/logout'), {
      method: 'POST',
      credentials: 'include',
    }),
  }

}
