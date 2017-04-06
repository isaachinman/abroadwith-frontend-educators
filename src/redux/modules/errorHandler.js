// This is a reducer which simply listens to all actions, and logs all errors out via Winston
// NB: This is an anti-pattern

import superagent from 'superagent'

// Blacklist specific failed actions here
const blacklist = [
  'LOGIN_FAIL', // Don't send or store plaintext passwords
]

export default function reducer(state = {}, action = {}) {

  if (action.type.indexOf('_FAIL') > -1 && blacklist.indexOf(action.type) === 0) {

    // If the action is a failure and isn't blacklisted, post it back to the server
    const request = superagent.post('/clientside-error')
    request.send(action)
    request.end(err => { if (err) console.log(err) })

  }

  return state

}
