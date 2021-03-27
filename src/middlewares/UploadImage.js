const multer = require('multer')
const path = require('path')
const uuid = require('uuid')

const defaultConfig = {
  field: 'upload'
}

const middleware = (config = defaultConfig) => {
  return (req, res, next) => {
    const uploadHandler = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          return cb(null, path.join(__dirname, '../../temp'))
        },
        filename: (req, file, cb) => {
          return cb(null, `${uuid.v4()}.jpg`)
        }
      }),
      limits: {
        fileSize: 2 * 1024 * 1024 // No mayor a 2mb por archivo
      }
    }).single(config.field)

    uploadHandler(req, res, function (error) {
      if (error) {
        console.log(error)
        next({
          error,
          status: 500
        })
      } else {
        next()
      }
    })
  }
}


module.exports = middleware