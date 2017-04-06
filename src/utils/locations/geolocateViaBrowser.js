import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import { update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'

export default function geolocateViaBrowser(dispatch, jwt, userObject) {

  const request = superagent.get('https://freegeoip.net/json/')
  request.end((err, res) => {

    if (!err && res && res.body && res.body.country_code && typeof res.body.country_code === 'string' && res.body.country_code.length === 2) {
      const newUserObject = Object.assign({}, userObject, {
        address: {
          country: res.body.country_code,
        },
      })
      dispatch(updateUser(jwtDecode(jwt).rid, newUserObject, jwt))
    }

  })

}
