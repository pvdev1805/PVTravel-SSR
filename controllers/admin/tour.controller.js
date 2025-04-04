module.exports.list = async (req, res) => {
  res.render('admin/pages/tour-list', {
    pageTitle: 'Tour List'
  })
}

module.exports.create = async (req, res) => {
  res.render('admin/pages/tour-create', {
    pageTitle: 'Create Tour'
  })
}
