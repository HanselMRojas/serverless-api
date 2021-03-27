const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  id: {
    type: String,
    default: null
  },
  /* -- Schema Here -- */
  name: {
    type: String,
    trim: true,
    required: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  etag: {
    type: String,
    trim: true,
    default: null
  },
  created_at: {
    type: Date,
    default: null
  }
}, {
  collection: 'images_hmr',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false
})

ImageSchema.index({ id: 1 })

module.exports = mongoose.model('Image', ImageSchema)
