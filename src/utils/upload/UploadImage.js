/* eslint-disable */

import config from 'config'

var lwip = require('lwip')
var exif = require('exif-parser')

var AWS = require('aws-sdk')

var s3 = new AWS.S3({
  region:'eu-central-1',
  accessKeyId: '***REMOVED***',
  secretAccessKey: '***REMOVED***'
})

var uploadImage = function(image_file,image_key,options,callback){
  var type;

  switch(image_file.mimetype){
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/pjpeg': type = 'jpg'; break;
    case 'image/png': type = 'png'; break;
    case 'application/pdf': type = 'pdf'; break;
    default:
      console.log("Error! Not supported image type:",image_file);
      if(callback) callback("Not supported image type.");
      return;
  }

  var width = options ? options.width : 1400;
  var height = options ? options.height : null;
  var crop_width = options ? options.crop ? options.crop.width : width : width;
  var crop_height = 0;
  var exifData;

  if (type === 'pdf') {
    var params = {
      ACL: 'public-read',
      Bucket: config.s3,
      Key: image_key,
      Body: image_file.buffer,
      ContentType: image_file.mimetypem,
      CacheControl: 'max-age=1209600'
    }
    s3.putObject(params, function(err, data) {
        if(err) console.log(err);
        if(callback) callback(err);
    });
  }

  if (type == "jpg") {
    exifData = exif.create(image_file.buffer).parse();
  }

  if (type != 'pdf') {
    lwip.open(image_file.buffer,type,function(err, image){
      var inverted = false;
      if(!height){
        height = image.height()*(width/image.width());
        crop_height = options ? options.crop ? options.crop.height : height : height;
      }
      var processed = image.batch();
      if(exifData){
        switch( exifData.tags.Orientation ) {
          case 2:
          processed = image.batch().flip('x'); // top-right - flip horizontal
          break;
          case 3:
          processed = image.batch().rotate(180); // bottom-right - rotate 180
          break;
          case 4:
          processed = image.batch().flip('y'); // bottom-left - flip vertically
          break;
          case 5:
          inverted = true;
          processed = image.batch().rotate(90).flip('x'); // left-top - rotate 90 and flip horizontal
          break;
          case 6:
          inverted = true;
          processed = image.batch().rotate(90); // right-top - rotate 90
          break;
          case 7:
          inverted = true;
          processed = image.batch().rotate(270).flip('x'); // right-bottom - rotate 270 and flip horizontal
          break;
          case 8:
          inverted = true;
          processed = image.batch().rotate(270); // left-bottom - rotate 270
          break;
        }
      }
      if(inverted){
        var newone = height;
        height = width;
        width = newone;
        var newone = crop_height;
        crop_height = crop_width;
        crop_width = newone;
      }

      console.log('OPTIONS: ', options)
      if (options.customCrop) {

        processed.crop(options.cropData.x, options.cropData.y, options.cropData.x + options.cropData.width, options.cropData.y + options.cropData.height)
          .resize(width,height)
          .toBuffer('jpg',{quality:90}, function(err,buffer){
            if(err){
              console.log(err);
              if(callback) callback(err);
            }
            else{
              var params = {
                ACL: 'public-read',
                Bucket: config.s3,
                Key: image_key,
                Body: buffer,
                ContentType: image_file.mimetypem,
                CacheControl: 'max-age=1209600'
              }
              s3.putObject(params, function(err, data) {
                  if(err) console.log(err);
                  if(callback) callback(err);
              });
            }
          });

      } else {
        processed.resize(width,height)
          .crop(crop_width,crop_height)
          .toBuffer('jpg',{quality:90}, function(err,buffer){
            if(err){
              console.log(err);
              if(callback) callback(err);
            }
            else{
              var params = {
                ACL: 'public-read',
                Bucket: config.s3,
                Key: image_key,
                Body: buffer,
                ContentType: image_file.mimetypem,
                CacheControl: 'max-age=1209600'
              }
              s3.putObject(params, function(err, data) {
                  if(err) console.log(err);
                  if(callback) callback(err);
              });
            }
          });
      }

    });
  }

}

module.exports = uploadImage;
