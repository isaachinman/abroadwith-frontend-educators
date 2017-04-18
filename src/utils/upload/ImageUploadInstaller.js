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

var newHeroPhoto = function(file, key, callback){
  uploadImage(file,key,{width:1400},callback)
}

var postSingle = function(req,path,photo,callback){
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

  // Set up the request
  var post_req;
  post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8')
      callback()
  })

  post_req.on('error', function (e) {
    callback(e)
  })
  post_req.write(post_data)
  post_req.end()
}

var educatorPhoto = express.Router()
educatorPhoto.post('/', function (req, res) {

  // if(!req.decoded_token || req.decoded_token.id != req.photoUserId){
  //   res.status(401).send('Restricted function.')
  //   return
  // }
  if(req.files.length > 1){
    res.status(400).send('Multiple files are not accepted.')
    return
  }
  if(req.files.length < 1){
    res.status(400).send('One file is required.')
    return
  }
  var imagePath = "/educators/"+req.photoUserId+'/'+(new Date().getTime())+".jpg"
  newHeroPhoto(req.files[0],imagePath.substring(1),function(err){
    var result = {}
    if(err){
      result[req.files[0].originalname] = {
        status:"ERROR",
        message: err.toString()
      }
      res.end(JSON.stringify(result))
    }
    else{
      postSingle(req,"/educators"+req.photoUserId,imagePath,function(err){
        if(!err){
          result[req.files[0].originalname] = {
            status:"OK",
            location: imagePath
          }
        }
        else{
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


var userIdHandler = require('./PhotoUserIdHandler')
var headerTokenHandler = require('./HeaderTokenHandler')

var installer = function(app) {
  app.param('photoUserId',userIdHandler)

  app.use(headerTokenHandler)

  app.use('/upload/educators/:photoUserId/photo',upload.array('file', 10))
  app.use('/upload/educators/:photoUserId/photo',educatorPhoto)

}

module.exports = installer
