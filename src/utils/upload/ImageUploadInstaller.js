/* eslint-disable */

import config from 'config'

const hostWithoutProtocol = config.apiHost.replace(/^https?\:\/\//i, "")

var express = require('express')
var https = require('https')
var http = require('http')

var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage, limits:{fileSize:100000000} })

var routerPost = express.Router()
var routerGet = express.Router()

var uploadImage = require("./UploadImage")

var newSquarePhoto = function(file, key, callback){
  uploadImage(file,key,{width:250,crop:{width:250,height:250}},callback)
}
var customCrop = function(file, key, cropData, callback) {
  uploadImage(file, key, { width: 250, height: 250, customCrop: true, cropData: cropData }, callback)
}

var newHeroPhoto = function(file, key, callback){
  uploadImage(file,key,{width:1400},callback)
}

var postSingle = function(req,path,photo,callback) {

  var post_data = JSON.stringify({pathName:photo})

  var post_options = {
      host: hostWithoutProtocol,
      port: config.apiPort,
      path: path,
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + req.token,
          'Content-Length': Buffer.byteLength(post_data),
          'Content-Type': "application/json"
      }
  }

  console.log('post_options: ', post_options)

  // Set up the request
  var post_req
  post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8')
      callback()
  })

  post_req.on('error', function(e) {
    callback(e)
  })
  post_req.write(post_data)
  post_req.end()

}

var postMultiple = function(req,path,photos,callback) {

  var data = {images:[]}
  var i = photos.length

  while (--i >= 0) {
    data.images.push({pathName:photos[i]})
  }

  var post_data = JSON.stringify(data)

  var post_options = {
      host: hostWithoutProtocol,
      port: config.apiPort,
      path: path,
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + req.token,
          'Content-Length': Buffer.byteLength(post_data),
          'Content-Type': "application/json"
      }
  }

  // Set up the request
  var post_req
  post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8')
      callback()
  })

  post_req.on('error', function (e) {
    callback(e)
  })

  // Post the data
  post_req.write(post_data)
  post_req.end()

}

var routerUser = express.Router()
routerUser.post('/', function(req, res) {

  console.log('HEADERS: ', JSON.parse(req.get('cropData')))
  console.log(typeof req.get('cropData'))

  if (!req.decoded_token || req.decoded_token.id != req.photoUserId) {
    res.status(401).send('Restricted function.')
    return
  }

  if (req.files.length > 1) {
    res.status(400).send('Multiple files are not accepted.')
    return
  }

  if (req.files.length < 1) {
    res.status(400).send('One file is required.')
    return
  }

  var imagePath = '/users/'+req.photoUserId+'/'+(new Date().getTime())+".jpg"

  customCrop(req.files[0], imagePath.substring(1), JSON.parse(req.get('cropData')), function(err) {

    var result = {}
    if (err) {

      result[req.files[0].originalname] = {
        status:"ERROR",
        message: err.toString()
      }
      res.end(JSON.stringify(result))

    } else {
      postSingle(req,"/users/"+req.photoUserId+"/photo", imagePath, function(err) {

        if (!err) {

          result[req.files[0].originalname] = {
            status:"OK",
            location: imagePath
          }

        } else {

          result[req.files[0].originalname] = {
            status:"ERROR",
            message: err.toString()
          }

        }
        res.end(JSON.stringify(result))
      })
    }
  })
})

var routerRoom = express.Router()
routerRoom.post('/', function(req, res) {

  if (!req.decoded_token || req.decoded_token.id != req.photoUserId) {
    res.status(401).send('Restricted function.')
    return
  }

  if (req.files.length > 1) {
    res.status(400).send('Multiple files are not accepted.')
    return
  }

  if (req.files.length < 1) {
    res.status(400).send('One file is required.')
    return
  }

  var imagePath = "/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/rooms/"+req.photoRoomId+"/"+(new Date().getTime())+".jpg"
  newHeroPhoto(req.files[0], imagePath.substring(1), function(err) {

    var result = {}

    if (err) {

      result[req.files[0].originalname] = {
        status:"ERROR",
        message: err.toString()
      }
      res.end(JSON.stringify(result))

    } else {
      postSingle(req,"/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/rooms/"+req.photoRoomId+"/photo", imagePath, function(err) {

        if (!err) {

          result[req.files[0].originalname] = {
            status:"OK",
            location: imagePath
          }

        } else {

          result[req.files[0].originalname] = {
            status:"ERROR",
            message: err.toString()
          }

        }
        res.end(JSON.stringify(result))
      })
    }
  })
})

var helper = function(req,res,file){

  newHeroPhoto(file, file.imagePath.substring(1), function(err){

    if (err) {

      req.result[file.originalname] = {
        status:"ERROR",
        message: err.toString()
      }

    } else {

      req.result[file.originalname] = {
        status:"OK",
        location: file.imagePath
      }
      req.successful.push(file.imagePath)

    }

    if (++req.done >= req.files.length) {

      for (var i=0; i<req.successful.length; i++) {

        // Upload each image individually
        postSingle(req,"/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/images", req.successful[i], function(err) {
          if (err) {
            res.status(500).send('Problem updating API.')
          } else {
            res.end(JSON.stringify(req.result))
          }
        })

      }

    }
  })
}

var routerHome = express.Router()
routerHome.post('/', function (req, res) {

  if (!req.decoded_token || req.decoded_token.id != req.photoUserId) {
    res.status(401).send('Restricted function.')
    return
  }

  console.log('files: ', req.files)

  var i = req.files.length
  req.done = 0
  req.successful = []
  req.result = {}

  while (--i >= 0) {
    req.files[i].imagePath = "/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/"+(new Date().getTime())+"_"+i+".jpg"
    helper(req,res,req.files[i])
  }
})


var routerId = express.Router()
routerId.post('/', function(req, res) {

  if (!req.decoded_token || req.decoded_token.id != req.idUserId) {
    res.status(401).send('Restricted function.')
    return
  }

  if (req.files.length > 1) {
    res.status(400).send('Multiple files are not accepted.')
    return
  }

  if (req.files.length < 1) {
    res.status(400).send('One file is required.')
    return
  }

  var imagePath = "/users/"+req.idUserId+"/ids/"+(new Date().getTime())
  imagePath += req.files[0].mimetype !== 'application/pdf' ? ".jpg" : ".pdf"

  newHeroPhoto(req.files[0], imagePath.substring(1), function(err) {

    var result = {}

    if (err) {

      result[req.files[0].originalname] = {
        status:"ERROR",
        message: err.toString()
      }
      res.end(JSON.stringify(result))

    } else {
      postSingle(req,"/users/"+req.idUserId+"/verification/id", imagePath, function(err) {

        if (!err) {

          result[req.files[0].originalname] = {
            status:"OK",
            location: imagePath
          }

        } else {
          result[req.files[0].originalname] = {
            status:"ERROR",
            message: err.toString()
          }
        }
        res.end(JSON.stringify(result))
      })
    }
  })
})

var routerCertificate = express.Router()
routerCertificate.post('/', function (req, res) {

  if (!req.decoded_token || req.decoded_token.id != req.idUserId){
    res.status(401).send('Restricted function.')
    return
  }

  if (req.files.length > 1) {
    res.status(400).send('Multiple files are not accepted.')
    return
  }

  if (req.files.length < 1) {
    res.status(400).send('One file is required.')
    return
  }

  var imagePath = "/users/"+req.idUserId+"/certificates/"+(new Date().getTime())
  imagePath += req.files[0].mimetype !== 'application/pdf' ? ".jpg" : ".pdf"

  newHeroPhoto(req.files[0],imagePath.substring(1),function(err) {

    var result = {}

    if (err) {

      result = {
        status:"ERROR",
        message: err.toString()
      }
      res.end(JSON.stringify(result))

    } else {

      postSingle(req,"/users/"+req.idUserId+"/verification/certification", imagePath, function(err) {

        if (!err) {

          result = {
            status:"OK",
            location: imagePath
          }

        } else {

          result = {
            status:"ERROR",
            message: err.toString()
          }

        }
        res.end(JSON.stringify(result))
      })
    }
  })
})

var userIdHandler = require('./PhotoUserIdHandler')
var homeIdHandler = require('./PhotoHomeIdHandler')
var roomIdHandler = require('./PhotoRoomIdHandler')
var idIdHandler = require('./IdUserIdHandler')
var headerTokenHandler = require('./HeaderTokenHandler')

var installer = function(app) {
  app.param('photoUserId',userIdHandler)
  app.param('photoHomeId',homeIdHandler)
  app.param('photoRoomId',roomIdHandler)
  app.param('idUserId',idIdHandler)

  app.use(headerTokenHandler)

  //TODO this app.use('/upload/*',upload.array('photos', 10));
  app.use('/upload/users/:photoUserId/photo',upload.array('file', 10))
  app.use('/upload/users/:photoUserId/photo',routerUser)

  app.use('/upload/users/:photoUserId/homes/:photoHomeId/photos',upload.array('file', 10))
  app.use('/upload/users/:photoUserId/homes/:photoHomeId/photos',routerHome)

  app.use('/upload/users/:photoUserId/homes/:photoHomeId/rooms/:photoRoomId/photo',upload.array('file', 10))
  app.use('/upload/users/:photoUserId/homes/:photoHomeId/rooms/:photoRoomId/photo',routerRoom)

  app.use('/upload/users/:idUserId/id',upload.array('photos', 10))
  app.use('/upload/users/:idUserId/id',routerId)

  app.use('/upload/users/:idUserId/certificate',upload.array('file', 10))
  app.use('/upload/users/:idUserId/certificate',routerCertificate)

}

module.exports = installer
