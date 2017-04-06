import config from 'config.js'
import superagent from 'superagent'
import { login, facebookLogin, googleLogin } from 'redux/modules/auth'
import { openVerifyEmailSentModal } from 'redux/modules/ui/modals'

// Login stuff
const SIGNUP = 'abroadwith/SIGNUP'
const SIGNUP_SUCCESS = 'abroadwith/SIGNUP_SUCCESS'
const SIGNUP_FAIL = 'abroadwith/SIGNUP_FAIL'

const initialState = {
  loading: false,
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SIGNUP:
      return {
        ...state,
        loading: true,
      }
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      }
    case SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.err,
      }
    default:
      return state
  }
}

export function signup(type, signupObject, googleToken, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: SIGNUP })

    try {

      // Validate request
      if (!['HOST', 'STUDENT'].includes(signupObject.type)) {
        throw new Error('userType is invalid')
      }

      const { email, password, facebookToken, googleId } = signupObject // eslint-disable-line

      const request = superagent.post(`${config.apiHost}/users`).send(signupObject).withCredentials()

      request.end(err => {

        if (err) {

          dispatch({ type: SIGNUP_FAIL, err })

        } else {

          // Signup was success
          dispatch({ type: SIGNUP_SUCCESS })
          cb()

          // Log the user in
          if (type === 'email') {
            dispatch(login(email, password))
          } else if (type === 'facebook') {
            dispatch(facebookLogin(email, facebookToken))
          } else if (type === 'google') {
            dispatch(googleLogin(email, googleToken))
          }

          // Open email verification sent modal
          dispatch(openVerifyEmailSentModal())


        }


      })

    } catch (err) {
      dispatch({ type: SIGNUP_FAIL, err })
    }
  }
}
