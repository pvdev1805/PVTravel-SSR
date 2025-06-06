const moment = require('moment')
const slugify = require('slugify')
const Category = require('../../models/category.model')
const AccountAdmin = require('../../models/account-admin.model')

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

  // Filter by createdBy
  if (req.query.createdBy) {
    find.createdBy = req.query.createdBy
  }
  // End - Filter by createdBy

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

  const totalRecord = await Category.countDocuments(find)
  const totalPage = Math.ceil(totalRecord / limitItems)
  const skip = (page - 1) * limitItems
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  }
  // End Pagination

  const categoryList = await Category.find(find)
    .sort({
      position: 'desc'
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of categoryList) {
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

  // Get list account admin for filter
  const accountAdminList = await AccountAdmin.find({}).select('id fullName')

  res.render('admin/pages/category-list', {
    pageTitle: 'Category List',
    categoryList: categoryList,
    accountAdminList: accountAdminList,
    pagination: pagination
  })
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })

  const categoryTree = categoryHelper.buildCategoryTree(categoryList, '')

  res.render('admin/pages/category-create', {
    pageTitle: 'Create Category',
    categoryList: categoryTree
  })
}

module.exports.createPost = async (req, res) => {
  if (req.role.permissions.includes('category-create')) {
    if (req.body.position) {
      req.body.position = parseInt(req.body.position)
    } else {
      const totalRecord = await Category.countDocuments({})
      req.body.position = totalRecord + 1
    }

    req.body.createdBy = req.account._id
    req.body.updatedBy = req.account._id

    req.body.avatar = req.file ? req.file.path : ''

    const newRecord = new Category(req.body)
    await newRecord.save()

    req.flash('success', 'Create category successfully!')

    res.status(200).json({
      code: 'success'
      // message: 'Category created successfully!'
    })
  } else {
    res.status(403).json({
      code: 'error',
      message: 'You do not have permission to create category!'
    })
  }
}

module.exports.edit = async (req, res) => {
  try {
    const categoryList = await Category.find({
      deleted: false
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList, '')

    const id = req.params.id
    const categoryDetail = await Category.findOne({
      _id: id,
      deleted: false
    })

    res.render('admin/pages/category-edit', {
      pageTitle: 'Edit Category',
      categoryList: categoryTree,
      categoryDetail: categoryDetail
    })
  } catch (error) {
    console.log(error)
    res.redirect(`/${pathAdmin}/category/list`)
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes('category-edit')) {
      const id = req.params.id

      if (req.body.position) {
        req.body.position = parseInt(req.body.position)
      } else {
        const totalRecord = await Category.countDocuments({})
        req.body.position = totalRecord + 1
      }

      req.body.updatedBy = req.account._id

      if (req.file) {
        req.body.avatar = req.file.path
      } else {
        delete req.body.avatar
      }

      await Category.updateOne(
        {
          _id: id,
          deleted: false
        },
        req.body
      )

      req.flash('success', 'Update category successfully!')

      res.status(200).json({
        code: 'success'
      })
    } else {
      res.status(403).json({
        code: 'error',
        message: 'You do not have permission to edit category!'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(404).json({
      code: 'error',
      message: 'Category ID not found!'
    })
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    if (req.role.permissions.includes('category-delete')) {
      const id = req.params.id

      await Category.updateOne(
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

      req.flash('success', 'Delete category successfully!')

      res.status(200).json({
        code: 'success'
      })
    } else {
      res.status(403).json({
        code: 'error',
        message: 'You do not have permission to delete category!'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(404).json({
      code: 'error',
      message: 'Category ID not found!'
    })
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    if (!req.role.permissions.includes('category-edit')) {
      res.status(403).json({
        code: 'error',
        message: 'You do not have permission to change category status!'
      })
      return
    }
    const { option, ids } = req.body

    switch (option) {
      case 'active':
      case 'inactive':
        await Category.updateMany(
          {
            _id: { $in: ids }
          },
          {
            status: option
          }
        )

        req.flash('success', 'Change status successfully!')
        break
      case 'delete':
        if (!req.role.permissions.includes('category-delete')) {
          res.status(403).json({
            code: 'error',
            message: 'You do not have permission to delete category!'
          })
          return
        }
        await Category.updateMany(
          {
            _id: { $in: ids }
          },
          {
            deleted: true,
            deletedAt: Date.now(),
            deletedBy: req.account._id
          }
        )

        req.flash('success', 'Delete successfully!')
        break
    }

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      code: 'error',
      message: 'Update failed!'
    })
  }
}
