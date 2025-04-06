const AccountAdmin = require('../../models/accounts-admin.model')

module.exports.login = async (req, res) => {
  res.render('admin/pages/login', {
    pageTitle: 'Sign In'
  })
}

module.exports.register = async (req, res) => {
  res.render('admin/pages/register', {
    pageTitle: 'Sign Up'
  })
}

module.exports.registerPost = async (req, res) => {
  const { username, email, password } = req.body

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

  const newAccount = new AccountAdmin({
    username: username,
    email: email,
    password: password,
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
