const Joi = require('joi')

module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      'string.empty': 'Email is required!',
      'string.email': 'Email is invalid!'
    })
  })

  const { error } = schema.validate(req.body)

  if (error) {
    const errorMessage = error.details[0].message

    res.status(400).json({
      code: 'error',
      message: errorMessage
    })
    return
  }

  next()
}
