const moment = require('moment')
const slugify = require('slugify')

const Tour = require('../../models/tour.model')

module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
    status: 'active'
  }

  // Search by locationFrom
  if (req.query.locationFrom) {
    find.locationFrom = req.query.locationFrom.trim()
  }
  // End - Search by locationFrom

  // Search by locationTo
  if (req.query.locationTo) {
    const keyword = slugify(req.query.locationTo.trim(), {
      lower: true
    })

    const keywordRegex = new RegExp(keyword, 'i')
    find.slug = keywordRegex
  }
  // End - Search by locationTo

  // Search by departureDate
  if (req.query.departureDate) {
    const departureDateFormat = new Date(req.query.departureDate.trim())
    find.departureDate = departureDateFormat
  }
  // End - Search by departureDate

  // Passengers Quantity
  // Adults
  if (req.query.stockAdult) {
    const stockAdult = parseInt(req.query.stockAdult)
    find.stockAdult = {
      $gte: stockAdult
    }
  }
  // End - Adults

  // Children
  if (req.query.stockChildren) {
    const stockChildren = parseInt(req.query.stockChildren)
    find.stockChildren = {
      $gte: stockChildren
    }
  }
  // End - Children

  // Babies
  if (req.query.stockBaby) {
    const stockBaby = parseInt(req.query.stockBaby)
    find.stockBaby = {
      $gte: stockBaby
    }
  }
  // End - Babies
  // End - Passengers Quantity

  // Search by price range
  if (req.query.priceRange) {
    const [minPrice, maxPrice] = req.query.priceRange.split('-').map((price) => parseFloat(price))
    find.priceNewAdult = {
      $gte: minPrice,
      $lte: maxPrice
    }
  }
  // End - Search by price range

  const tourList = await Tour.find(find).sort({
    position: 'desc'
  })

  tourList.forEach((tour) => {
    tour.discount = parseInt(((tour.priceAdult - tour.priceNewAdult) / tour.priceAdult) * 100)
    tour.departureDateFormat = moment(tour.departureDate).format('DD/MM/YYYY')
  })

  res.render('client/pages/search', {
    pageTitle: 'Search Results',
    tourList: tourList
  })
}
