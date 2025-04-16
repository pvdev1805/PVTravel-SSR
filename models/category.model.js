const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    parent: String,
    position: Number,
    avatar: String,
    description: String,
    createdBy: String,
    updatedBy: String,
    slug: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true // generate createdAt and updatedAt fields automatically
  }
)

const Category = mongoose.model('Category', schema, 'categories')

module.exports = Category
