module.exports.login = async (req, res) => {
  res.render('admin/pages/login', {
    pageTitle: 'Sign In'
  })
}
