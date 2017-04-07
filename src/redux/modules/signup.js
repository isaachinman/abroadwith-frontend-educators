import config from 'config'
import superagent from 'superagent'

// Signup actions
const SIGNUP = 'abroadwith-educators/SIGNUP'
const SIGNUP_SUCCESS = 'abroadwith-educators/SIGNUP_SUCCESS'
const SIGNUP_FAIL = 'abroadwith-educators/SIGNUP_FAIL'

const initialState = {
  loading: false,
  loaded: false,
  error: null,
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
        error: action.error,
      }
    default:
      return state
  }
}

export function signup(signupObject) {

  return async dispatch => {

    dispatch({ type: SIGNUP })

    try {

      const request = superagent.post(`${config.apiHost}/educators`)
      request.send(signupObject)

      request.end((err, res) => {

        if (err) {

          dispatch({ type: SIGNUP_FAIL, error: err })

        } else {

          // Request was successful
          dispatch({ type: SIGNUP_SUCCESS, result: res })

        }

      })

    } catch (err) {
      dispatch({ type: SIGNUP_FAIL, err })
    }
  }

}
