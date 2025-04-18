const Joi = require('joi')

module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Category name is required!'
    }),
    parent: Joi.string().allow(''),
    position: Joi.string().allow(''),
    status: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
    description: Joi.string().allow('')
  })

  const { error } = schema.validate(req.body)

  if (error) {
    const errorMessage = error.details[0].message

    res.status(400).json({
      code: 'error',
      message: errorMessage
    })
  }

  next()
}
