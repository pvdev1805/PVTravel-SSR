const moment = require('moment')
const Tour = require('../../models/tour.model')
const Promotion = require('../../models/promotion.model')

module.exports.home = async (req, res) => {
  // Section 2
  const tourListSection2 = await Tour.find({
    priceNewAdult: { $gt: 0 },
    deleted: false,
    status: 'active'
  })
    .sort({
      position: 'desc'
    })
    .limit(6)

  tourListSection2.forEach((tour) => {
    tour.discount = parseInt(((tour.priceAdult - tour.priceNewAdult) / tour.priceAdult) * 100)
    tour.departureDateFormat = moment(tour.departureDate).format('DD/MM/YYYY')
  })

  const promotionDetail = await Promotion.findOne({})
  if (promotionDetail) {
    promotionDetail.maxDiscountAmount = parseFloat(promotionDetail.maxDiscountAmount).toFixed(2)
  }
  // End - Section 2

  res.render('client/pages/home', {
    pageTitle: 'Homepage',
    tourListSection2: tourListSection2,
    promotionDetail: promotionDetail
  })
}
