const express = require('express')
const router = express.Router()
const S3 = require('./middlewares/UploadS3')

const { uploadImage } = require('./controllers/ImageController')

router.post('/upload', [
  S3({ field: 'image', route: 'public/img/uploads/' })
], uploadImage)

module.exports = router
