module.exports.list = async (req, res) => {
  res.render('admin/pages/setting-list', {
    pageTitle: 'Settings'
  })
}

module.exports.websiteInfo = async (req, res) => {
  res.render('admin/pages/setting-website-info', {
    pageTitle: 'Website Info'
  })
}
