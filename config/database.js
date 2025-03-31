const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE)
    console.log('Database connected successfully!')
  } catch (error) {
    console.log('Database connected failed!', error)
  }
}
