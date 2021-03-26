/**
 * UploadImage
 * Upload Image to AMAZON S3
 *
 * @method POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.uploadImage = (req, res, next) => {
  try {
    const { file } = req
    return res.status(201).json({
      status: 201,
      message: file
    })
  } catch (error) {
    next({
      message: error,
      status: 500
    })
  }
}
