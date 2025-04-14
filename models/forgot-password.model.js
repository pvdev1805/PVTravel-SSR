const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  email: String,
  otp: String,
  expiredAt: {
    type: Date,
    expires: 0
  }
})

const ForgotPassword = mongoose.model('ForgotPassword', schema, 'forgot-password')

module.exports = ForgotPassword
