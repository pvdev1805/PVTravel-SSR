const Joi = require('joi')

module.exports.editPatch = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().messages({
      'string.empty': 'Full name is required!'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required!',
      'string.email': 'Email is invalid!'
    }),
    phone: Joi.string()
      .required()
      .custom((value, helpers) => {
        const phoneRegex = /^(61|0)[2-578]\d{8}$/g
        if (!phoneRegex.test(value)) {
          return helpers.error('string.pattern.base', {
            pattern: phoneRegex,
            value: value
          })
        }
      }),
    avatar: Joi.string().allow('')
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
