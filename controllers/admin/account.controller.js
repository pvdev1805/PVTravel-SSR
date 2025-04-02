module.exports.login = async (req, res) => {
  res.render('admin/pages/login', {
    pageTitle: 'Sign In'
  })
}

module.exports.register = async (req, res) => {
  res.render('admin/pages/register', {
    pageTitle: 'Sign Up'
  })
}
