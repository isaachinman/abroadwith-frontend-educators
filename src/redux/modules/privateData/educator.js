import config from 'config'
import jwtDecode from 'jwt-decode'
import superagent from 'superagent'

// Load private educator object
const LOAD_EDUCATOR_WITH_AUTH = 'abroadwith-educators/LOAD_EDUCATOR_WITH_AUTH'
const LOAD_EDUCATOR_WITH_AUTH_SUCCESS = 'abroadwith-educators/LOAD_EDUCATOR_WITH_AUTH_SUCCESS'
const LOAD_EDUCATOR_WITH_AUTH_FAIL = 'abroadwith-educators/LOAD_EDUCATOR_WITH_AUTH_FAIL'

const initialState = {
  loading: false,
  loaded: false,
  data: {},
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_EDUCATOR_WITH_AUTH:
      return {
        ...state,
        loaded: false,
        loading: true,
      }
    case LOAD_EDUCATOR_WITH_AUTH_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        data: action.result,
      }
    case LOAD_EDUCATOR_WITH_AUTH_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error,
      }
    default:
      return state
  }
}

export function loadEducatorWithAuth(jwt) {

  return async dispatch => {

    dispatch({ type: LOAD_EDUCATOR_WITH_AUTH })

    try {

      return new Promise((resolve, reject) => {

        const request = superagent.get(`${config.apiHost}/educators/${jwtDecode(jwt).rid}`)
        request.set({ Authorization: `Bearer ${(jwt)}` })

        request.end((err, { body } = {}) => {

          if (err) {

            reject(dispatch({ type: LOAD_EDUCATOR_WITH_AUTH_FAIL, err }))

          } else if (body) {

          // Load was successful
            resolve(dispatch({ type: LOAD_EDUCATOR_WITH_AUTH_SUCCESS, result: body }))

          } else {

            reject(dispatch({ type: LOAD_EDUCATOR_WITH_AUTH_FAIL, err: 'Unknown error' }))

          }

        })

      })

    } catch (err) {
      dispatch({ type: LOAD_EDUCATOR_WITH_AUTH_FAIL, err })
    }
  }

}
