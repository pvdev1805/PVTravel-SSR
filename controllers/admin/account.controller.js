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

module.exports.forgotPassword = async (req, res) => {
  res.render('admin/pages/forgot-password', {
    pageTitle: 'Forgot Password'
  })
}
