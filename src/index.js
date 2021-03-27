const express = require('express')
const router = express.Router()
const UPLOAD = require('./middlewares/UploadImage')

const { uploadImage } = require('./controllers/ImageController')

router.post('/upload', [
], uploadImage)

module.exports = router
