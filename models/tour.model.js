const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const schema = new mongoose.Schema(
  {
    name: String,
    category: String,
    position: Number,
    status: String,
    avatar: String,
    images: Array,
    priceAdult: {
      type: Number,
      set: (value) => parseFloat(value).toFixed(2)
    },
    priceChildren: {
      type: Number,
      set: (value) => parseFloat(value).toFixed(2)
    },
    priceBaby: {
      type: Number,
      set: (value) => parseFloat(value).toFixed(2)
    },
    priceNewAdult: {
      type: Number,
      set: (value) => parseFloat(value).toFixed(2)
    },
    priceNewChildren: {
      type: Number,
      set: (value) => parseFloat(value).toFixed(2)
    },
    priceNewBaby: {
      type: Number,
      set: (value) => parseFloat(value).toFixed(2)
    },
    stockAdult: Number,
    stockChildren: Number,
    stockBaby: Number,
    locations: Array,
    time: String,
    vehicle: String,
    departureDate: Date,
    information: String,
    schedules: Array,
    createdBy: String,
    updatedBy: String,
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
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
)

const Tour = mongoose.model(
  'Tour',
  schema,
  'tours' // Collection name in MongoDB
)

module.exports = Tour
