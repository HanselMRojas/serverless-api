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

exports.listImages = async (req, res, next) => {
  try {
    const images = await ImageSchema.find({})
    const total = await ImageSchema.countDocuments()

    res.status(200).json({
      payload: images,
      total
    })
  } catch (error) {
    next({ error, status: 500 })
  }
}

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
      .resize(1000)
      .png({ compressionLevel: 9, quality: 80 })
      .toBuffer()

    const img = {
      id: uuid.v4(),
      name,
      url: null,
      createdAt: Date.now()
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
        etag: aws.Etag,
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
    next({
      error,
      status: 500
    })
  }
}
