// This endpont accompanies the errorHandler reducer
// When a client encounters a redux error, it POSTs data back to the server,
// which then uploads the logs to the S3 bucket via the winston transport

import logger from 'helpers/logger'

export default (app) => {

  // This is an endpoint specifically for reporting redux action errors
  app.post('/clientside-error', (req, res) => {

    const errorReport = req.body

    console.log('errorReport: ', errorReport)

    logger.error({
      error: errorReport,
    })

    res.sendStatus(200)
    res.end()


  })

}
