const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    role: String,
    positionCompany: String,
    status: String,
    password: String,
    avatar: String,
    createdBy: String,
    updatedBy: String,
    slug: {
      type: String,
      slug: 'fullName',
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

const AccountAdmin = mongoose.model('AccountAdmin', schema, 'accounts-admin')

module.exports = AccountAdmin
