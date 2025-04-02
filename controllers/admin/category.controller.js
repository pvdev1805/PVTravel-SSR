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
