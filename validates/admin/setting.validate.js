const Joi = require('joi')

module.exports.roleCreatePost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Role name is required!'
    }),
    description: Joi.string().allow(''),
    permissions: Joi.array().required().messages({
      'array.base': 'Permissions is required!'
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
