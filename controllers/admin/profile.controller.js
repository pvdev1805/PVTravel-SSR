module.exports.edit = async (req, res) => {
  res.render('admin/pages/profile-edit', {
    pageTitle: 'Profile'
  })
}

module.exports.changePassword = async (req, res) => {
  res.render('admin/pages/profile-change-password', {
    pageTitle: 'Change Password'
  })
}
