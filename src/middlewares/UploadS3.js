const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const uuid = require('uuid')

const s3 = new AWS.S3({
  ACL:'public-read',
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
})

const defaultConfig = {
  field: 'upload',
  route: '/uploads'
}

module.exports = (config = defaultConfig) => {
  return (req, res, next) => {
    const uploadHandler = multer({
      storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        key: (reqImg, file, cb) => {
          cb(null, `${config.route}/${uuid.v4()}.jpg`)
        }
      }),
      limits: {
        fileSize: 2 * 1024 * 1024 // No mayor a 2mb por archivo
      }
    }).single(config.field)

    uploadHandler(req, res, function (err) {
      if (err) {
        next({
          message: err,
          status: 500
        })
      } else {
        next()
      }
    })
  }
}
