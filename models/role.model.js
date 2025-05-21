const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    permissions: Array,
    createdBy: String,
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAr: Date
  },
  {
    timestamps: true
  }
)

const Role = mongoose.model('Role', schema, 'roles')

module.exports = Role
