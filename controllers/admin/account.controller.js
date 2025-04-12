const AccountAdmin = require('../../models/accounts-admin.model')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports.login = async (req, res) => {
  res.render('admin/pages/login', {
    pageTitle: 'Sign In'
  })
}

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body

  // Check whether the account exists or not
  const existAccount = await AccountAdmin.findOne({
    email: email
  })

  if (!existAccount) {
    res.status(404).json({
      code: 'error',
      message: 'Account does not exist!'
    })
    return
  }

  // Check whether the password is correct or not
  const isPasswordValid = await bcrypt.compare(password, existAccount.password)
  if (!isPasswordValid) {
    res.status(401).json({
      code: 'error',
      message: 'Password is incorrect!'
    })
    return
  }

  // Check whether the account is activated or not
  if (existAccount.status !== 'active') {
    res.status(403).json({
      code: 'error',
      message: 'Account is not activated!'
    })
    return
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: existAccount._id,
      email: existAccount.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? '30d' : '1d' // Token will be expired in 1 day or 30 days
    }
  )

  // Set the token in the cookie
  res.cookie('token', token, {
    maxAge: rememberPassword ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000), // Token will be expired in 1 day or 30 days
    httpOnly: true, // Only accessible by the web server
    sameSite: 'strict' // CSRF protection
  })

  res.status(200).json({
    code: 'success',
    message: 'Login successfully!'
  })
}

module.exports.register = async (req, res) => {
  res.render('admin/pages/register', {
    pageTitle: 'Sign Up'
  })
}

module.exports.registerPost = async (req, res) => {
  const { fullName, email, password } = req.body

  const existEmail = await AccountAdmin.findOne({
    email: email
  })

  if (existEmail) {
    res.status(409).json({
      code: 'error',
      message: 'Email already exists!'
    })
    return
  }

  // Encrypt password using bcrypt
  const salt = await bcrypt.genSalt(10) // Generate a unique and random salt with 10 cycles of hashing
  const hashedPassword = await bcrypt.hash(password, salt)

  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: 'initial'
  })

  await newAccount.save()

  res.status(200).json({
    code: 'success',
    message: 'Register successfully!'
  })
}

module.exports.registerInitial = async (req, res) => {
  res.render('admin/pages/register-initial', {
    pageTitle: 'Initialize Account'
  })
}

module.exports.forgotPassword = async (req, res) => {
  res.render('admin/pages/forgot-password', {
    pageTitle: 'Forgot Password'
  })
}

module.exports.otpPassword = async (req, res) => {
  res.render('admin/pages/otp-password', {
    pageTitle: 'Enter OTP Password'
  })
}

module.exports.resetPassword = async (req, res) => {
  res.render('admin/pages/reset-password', {
    pageTitle: 'Reset Password'
  })
}

module.exports.logout = async (req, res) => {
  // Clear the cookie
  res.clearCookie('token')

  res.status(200).json({
    code: 'success',
    message: 'Logout successfully!'
  })
}