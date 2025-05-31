const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    promotionName: String,
    promotionExpiredDate: Date,
    maxDiscountAmount: Number,
    createdBy: String,
    updatedBy: String
  },
  {
    timestamps: true
  }
)

const Promotion = mongoose.model('Promotion', schema, 'promotions')

module.exports = Promotion
