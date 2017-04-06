/* eslint-disable */

const jwt = require('jsonwebtoken')

const public_key = '-----BEGIN PUBLIC KEY-----\n' +
'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwiFPc0o+YUiBbrXkF7SA' +
'd7zshZJf2sCvnEy+CTrn5xcJDnbV8x94bxbWari9B3O2cZmcXyNAVBvfsiDXzheJ' +
'8vX1uotXNiGi3a9yyUCo7Ga8g3QljjMjwHgbUAsIO1tjZL9shSS8qoummqi+c57b' +
'1nWkpbP8S2eR9Qf2ZVLklIm8alH6IeR1j07Tt9mnUBPG+ivhnmkLHENFYUPjuO4p' +
'DsRVHGAaXusDDU89R6KGO7UdVOn9GWdTsem27lbCrVE+RqPnTq1WfwalOApwZYeH' +
'B06Jsi/4FQp+8N3GG3RlzF1boEaN4xzBLzgQ7ll2TlkCWaBpZitqi6gK/aaHrOd7' +
'IwIDAQAB\n' +
'-----END PUBLIC KEY-----'

module.exports = function (req, res, next) {
  // TODO this is a temporary fix using a separated header. Unify API and here using custom header.
  if (req.headers && req.headers.abroadauth) {
    const parts = req.headers.abroadauth.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      req.token = parts[1]
      const decoded = jwt.verify(req.token, new Buffer(public_key, 'utf8'), { algorithms: ['RS512'] }, function (err, payload) {
        if (!err) {
          req.decoded_token = {}
          req.decoded_token.name = payload.name
          req.decoded_token.email = payload.email
          req.decoded_token.id = payload.rid
          console.log('Uploading for user: ', req.decoded_token)
          next()
          return
        }
        else {
          console.log('Error: ' + err + ', while processing token: ' + req.token)
          next()
          return
        }
      })
    }
    else {
      next()
    }
  }
  else {
    next()
  }
}
