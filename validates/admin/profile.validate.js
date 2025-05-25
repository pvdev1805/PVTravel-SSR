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

module.exports.changePasswordPatch = (req, res, next) => {
  const schema = Joi.object({
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
      }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
      'string.empty': 'Confirm password is required!',
      'any.only': 'Confirm password must match the password!'
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
