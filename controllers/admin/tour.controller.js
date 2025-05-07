const moment = require('moment')

const Category = require('../../models/category.model')
const City = require('../../models/city.model')
const Tour = require('../../models/tour.model')
const AccountAdmin = require('../../models/accounts-admin.model')

const categoryHelper = require('../../helpers/category.helper')

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }

  const tourList = await Tour.find(find).sort({
    position: 'desc'
  })

  for (const item of tourList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoAccountCreated.fullName
    }

    if (item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = infoAccountUpdated.fullName
    }

    item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
    item.updatedAtFormat = moment(item.updatedAt).format('HH:mm - DD/MM/YYYY')
  }

  res.render('admin/pages/tour-list', {
    pageTitle: 'Tour List',
    tourList: tourList
  })
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })

  const categoryTree = categoryHelper.buildCategoryTree(categoryList, '')

  const cityList = await City.find({})

  res.render('admin/pages/tour-create', {
    pageTitle: 'Create Tour',
    categoryList: categoryTree,
    cityList: cityList
  })
}

module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position)
  } else {
    const totalRecord = await Tour.countDocuments({})
    req.body.position = totalRecord + 1
  }

  req.body.createdBy = req.account._id
  req.body.updatedBy = req.account._id
  req.body.avatar = req.file ? req.file.path : ''
  req.body.priceAdult = req.body.priceAdult ? parseFloat(req.body.priceAdult) : 0
  req.body.priceChildren = req.body.priceChildren ? parseFloat(req.body.priceChildren) : 0
  req.body.priceBaby = req.body.priceBaby ? parseFloat(req.body.priceBaby) : 0
  req.body.priceNewAdult = req.body.priceNewAdult ? parseFloat(req.body.priceNewAdult) : 0
  req.body.priceNewChildren = req.body.priceNewChildren ? parseFloat(req.body.priceNewChildren) : 0
  req.body.priceNewBaby = req.body.priceNewBaby ? parseFloat(req.body.priceNewBaby) : 0
  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0
  req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0
  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : []
  req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null
  req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : []

  const newRecord = new Tour(req.body)
  await newRecord.save()

  req.flash('success', 'Create tour successfully!')

  res.status(200).json({
    code: 'success'
  })
}

module.exports.trash = async (req, res) => {
  res.render('admin/pages/tour-trash', {
    pageTitle: 'Tour Trash'
  })
}
