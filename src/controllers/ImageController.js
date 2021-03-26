const AWS = require('aws-sdk')
const uuid = require('uuid')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

const S3 = new AWS.S3({
  ACL:'public-read',
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
})

/**
 * UploadImage
 * Upload Image to AMAZON S3
 *
 * @method POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { file } = req
    console.log(file.path)
    const outputBuffer = await sharp(file.path).toFile('fuck.png')
    console.log(outputBuffer)
    // const params = {
    //   Bucket: process.env.AWS_S3_BUCKET_NAME,
    //   Key:  `public/img/uploads/${uuid.v4()}.png`,
    //   Body: outputBuffer,
    //   ContentType: 'image/png',
    //   ACL: 'public-read'
    // } 

    // await S3.upload(params)

    res.status(201).json({
      status: 201,
      file
    })
  } catch (error) {
    console.log(error)
    next({
      error,
      status: 500
    })
  }
}
