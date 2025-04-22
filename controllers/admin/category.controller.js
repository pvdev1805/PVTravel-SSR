const moment = require('moment')
const Category = require('../../models/category.model')
const AccountAdmin = require('../../models/accounts-admin.model')

const categoryHelper = require('../../helpers/category.helper')

module.exports.list = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  }).sort({
    position: 'desc'
  })

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

  res.render('admin/pages/category-list', {
    pageTitle: 'Category List',
    categoryList: categoryList
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
    const id = req.params.id

    if ((req, body.position)) {
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
  } catch (error) {
    console.log(error)
    res.status(404).json({
      code: 'error',
      message: 'Category ID not found!'
    })
  }
}
