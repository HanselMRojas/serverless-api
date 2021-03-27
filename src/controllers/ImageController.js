const AWS = require('aws-sdk')
const uuid = require('uuid')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

const ImageSchema = require('../schemas/ImageSchema')

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
    const { file, name } = req.body
    const outputBuffer = await sharp(Buffer.from(file, 'base64'))
      .toFormat('png')
      .toBuffer()

    const img = {
      id: uuid.v4(),
      name,
      url: null,
      created_at: Date.now()
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key:  `public/img/uploads/${img.id}.png`,
      Body: outputBuffer,
      ContentType: 'image/png',
      ACL: 'public-read'
    }

    S3.upload(params, async (err, aws) => {
      const newImage = new ImageSchema({
        ...img,
        url: aws.Location
      })

      const payload = await newImage.save()

      res.status(201).json({
        status: 201,
        payload,
        meesage: 'Image uploaded!'
      })
    })
  } catch (error) {
    console.log(error)
    next({
      error,
      status: 500
    })
  }
}
