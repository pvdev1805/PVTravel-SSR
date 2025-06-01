const moment = require('moment')
const Tour = require('../../models/tour.model')
const Promotion = require('../../models/promotion.model')
const Category = require('../../models/category.model')

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

  // Section 4 - Domestic Tours
  const domesticTour = await Category.findOne({
    name: 'Domestic Tours'
  })

  const domesticTourId = domesticTour.id

  const listCategory = [domesticTourId]

  const listSubCategory = await Category.find({
    parent: domesticTourId,
    deleted: false,
    status: 'active'
  })

  listSubCategory.forEach((subCategory) => {
    listCategory.push(subCategory.id)
  })

  const tourListSection4 = await Tour.find({
    category: { $in: listCategory },
    deleted: false,
    status: 'active'
  })
    .sort({
      position: 'desc'
    })
    .limit(8)

  for (const tour of tourListSection4) {
    tour.discount = parseInt(((tour.priceAdult - tour.priceNewAdult) / tour.priceAdult) * 100)
    tour.departureDateFormat = moment(tour.departureDate).format('DD/MM/YYYY')
  }
  // End - Section 4 - Domestic Tours

  res.render('client/pages/home', {
    pageTitle: 'Homepage',
    tourListSection2: tourListSection2,
    tourListSection4: tourListSection4,
    promotionDetail: promotionDetail
  })
}
