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

module.exports.accountAdminCreatePost = (req, res, next) => {
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
      })
      .messages({
        'string.empty': 'Phone number is required!',
        'string.pattern.base': 'Phone number is invalid!'
      }),
    role: Joi.string().allow(''),
    positionCompany: Joi.string().required().messages({
      'string.empty': 'Position in company is required!'
    }),
    status: Joi.string().allow(''),
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

module.exports.accountAdminEditPatch = (req, res, next) => {
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
      })
      .messages({
        'string.empty': 'Phone number is required!',
        'string.pattern.base': 'Phone number is invalid!'
      }),
    role: Joi.string().allow(''),
    positionCompany: Joi.string().required().messages({
      'string.empty': 'Position in company is required!'
    }),
    status: Joi.string().allow(''),
    password: Joi.string()
      .allow('')
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
