const Joi = require('joi')

module.exports.registerPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().min(5).max(50).messages({
      'string.empty': 'Full name is required!',
      'string.min': 'Full name must be at least 5 characters!',
      'string.max': 'Full name must not exceed 50 characters!'
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'Email is required!',
      'string.email': 'Email is invalid!'
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error('password.uppercase')
        }
        if (!/[a-z]/.test(value)) {
          return helpers.error('password.lowercase')
        }
        if (!/\d/.test(value)) {
          return helpers.error('password.number')
        }
        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error('password.special')
        }
        return value
      })
      .messages({
        'string.empty': 'Password is required!',
        'string.min': 'Password must be at least 8 characters!',
        'password.uppercase': 'Password must contain at least one uppercase letter!',
        'password.lowercase': 'Password must contain at least one lowercase letter!',
        'password.number': 'Password must contain at least one digit!',
        'password.special': 'Password must contain at least one special character!'
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
