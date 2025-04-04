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

module.exports.accountAdminList = async (req, res) => {
  res.render('admin/pages/setting-account-admin-list', {
    pageTitle: 'Admin Account List'
  })
}

module.exports.accountAdminCreate = async (req, res) => {
  res.render('admin/pages/setting-account-admin-create', {
    pageTitle: 'Create Admin Account'
  })
}

module.exports.roleList = async (req, res) => {
  res.render('admin/pages/setting-role-list', {
    pageTitle: 'Role List'
  })
}
