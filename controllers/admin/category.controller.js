const Category = require('../../models/category.model')

module.exports.list = async (req, res) => {
  res.render('admin/pages/category-list', {
    pageTitle: 'Category List'
  })
}

module.exports.create = async (req, res) => {
  res.render('admin/pages/category-create', {
    pageTitle: 'Create Category'
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

  const newRecord = new Category(req.body)
  await newRecord.save()

  res.status(200).json({
    code: 'success',
    message: 'Category created successfully'
  })
}
