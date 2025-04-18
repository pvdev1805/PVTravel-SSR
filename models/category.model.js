const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const schema = new mongoose.Schema(
  {
    name: String,
    parent: String,
    position: Number,
    avatar: String,
    description: String,
    createdBy: String,
    updatedBy: String,
    status: String,
    slug: {
      type: String,
      slug: 'name',
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
    timestamps: true // generate createdAt and updatedAt fields automatically
  }
)

const Category = mongoose.model('Category', schema, 'categories')

module.exports = Category
