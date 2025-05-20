const moment = require('moment')
const slugify = require('slugify')

const Category = require('../../models/category.model')
const City = require('../../models/city.model')
const Tour = require('../../models/tour.model')
const AccountAdmin = require('../../models/accounts-admin.model')

const categoryHelper = require('../../helpers/category.helper')

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }

  // Filter by status
  if (req.query.status) {
    find.status = req.query.status
  }
  // End - Filter by status

  // Filter by creator
  if (req.query.createdBy) {
    find.createdBy = req.query.createdBy
  }
  // End - Filter by creator

  // Filter by startDate and endDate
  const dateFilter = {}
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf('day').toDate()
    dateFilter.$gte = startDate
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).startOf('day').toDate()
    dateFilter.$lte = endDate
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter
  }
  // End - Filter by startDate and endDate

  // Search
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    })
    const keywordRegex = new RegExp(keyword)
    find.slug = keywordRegex
  }
  // End - Search

  // Pagination
  const limitItems = 5
  let page = 1
  if (req.query.page) {
    const currentPage = parseInt(req.query.page)
    if (currentPage > 0) {
      page = currentPage
    }
  }

  const totalRecord = await Tour.countDocuments(find)
  const totalPage = Math.ceil(totalRecord / limitItems)
  const skip = (page - 1) * limitItems
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  }
  // End - Pagination

  const tourList = await Tour.find(find)
    .sort({
      position: 'desc'
    })
    .limit(limitItems)
    .skip(skip)

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

  // Get Account Admin list
  const accountAdminList = await AccountAdmin.find({}).select('id fullName')
  // End - Get Account Admin list

  res.render('admin/pages/tour-list', {
    pageTitle: 'Tour List',
    tourList: tourList,
    accountAdminList: accountAdminList,
    pagination: pagination
  })
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { ids, option } = req.body

    switch (option) {
      case 'active':
      case 'inactive':
        await Tour.updateMany(
          {
            _id: {
              $in: ids
            }
          },
          {
            status: option
          }
        )

        req.flash('success', 'Change status tour(s) successfully!')
        break
      case 'delete':
        await Tour.updateMany(
          {
            _id: {
              $in: ids
            }
          },
          {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: req.account._id
          }
        )

        req.flash('success', 'Delete tour(s) successfully!')
        break
    }

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Error: Failed to process the request!'
    })
  }
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
  const find = {
    deleted: true
  }

  const tourList = await Tour.find(find).sort({
    position: 'desc'
  })

  for (const item of tourList) {
    if (item.deletedBy) {
      const infoAccountDeleted = await AccountAdmin.findOne({
        _id: item.deletedBy
      })

      item.deletedByFullName = infoAccountDeleted.fullName
    }

    item.deletedAtFormat = moment(item.deletedAt).format('HH:mm - DD/MM/YYYY')
  }

  res.render('admin/pages/tour-trash', {
    pageTitle: 'Tour Trash',
    tourList: tourList
  })
}

module.exports.trashChangeMultiPatch = async (req, res) => {
  try {
    const { ids, option } = req.body

    switch (option) {
      case 'undo':
        await Tour.updateMany(
          {
            _id: {
              $in: ids
            }
          },
          {
            $set: {
              deleted: false
            },
            $unset: {
              deletedAt: '',
              deletedBy: ''
            }
          }
        )

        req.flash('success', 'Restore tour successfully!')
        break
      case 'delete-destroy':
        await Tour.deleteMany({
          _id: {
            $in: ids
          }
        })

        req.flash('success', 'Delete tour(s) permanently successfully!')
        break
    }

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Error: Failed to process the request!'
    })
  }
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id

    const tourDetail = await Tour.findOne({
      _id: id,
      deleted: false
    })

    tourDetail.departureDateFormat = moment(tourDetail.departureDate).format('YYYY-MM-DD')

    const categoryList = await Category.find({
      deleted: false
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList, '')

    const cityList = await City.find({})

    res.render('admin/pages/tour-edit', {
      pageTitle: 'Edit Tour',
      tourDetail: tourDetail,
      categoryList: categoryTree,
      cityList: cityList
    })
  } catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`)
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id

    if (req.body.position) {
      req.body.position = parseInt(req.body.position)
    } else {
      const totalRecord = await Tour.countDocuments({})
      req.body.position = totalRecord + 1
    }

    req.body.updatedBy = req.account._id
    if (req.file) {
      req.body.avatar = req.file.path
    } else {
      delete req.body.avatar
    }

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

    await Tour.updateOne(
      {
        _id: id,
        deleted: false
      },
      req.body
    )

    req.flash('success', 'Update tour successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: error
    })
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id

    await Tour.updateOne(
      {
        _id: id,
        deleted: false
      },
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: req.account._id
      }
    )

    req.flash('success', 'Delete tour successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: error
    })
  }
}

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id

    await Tour.updateOne(
      {
        _id: id
      },
      {
        $set: {
          deleted: false
        },
        $unset: {
          deletedAt: '',
          deletedBy: ''
        }
      }
    )

    req.flash('success', 'Restore tour successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: error
    })
  }
}

module.exports.deleteDestroyPatch = async (req, res) => {
  try {
    const id = req.params.id

    await Tour.deleteOne({
      _id: id
    })

    req.flash('success', 'Delete tour permanently successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: error
    })
  }
}
