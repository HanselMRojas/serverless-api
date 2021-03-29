const express = require('express')
const router = express.Router()

const {
  uploadImage,
  listImages
} = require('./controllers/ImageController')

router.get('/images', [
], listImages)

router.post('/images', [
], uploadImage)

module.exports = router
