const bcrypt = require('bcryptjs')

const AccountAdmin = require('../../models/account-admin.model')
const Role = require('../../models/role.model')

module.exports.edit = async (req, res) => {
  const profileDetail = await AccountAdmin.findOne({
    _id: req.account._id
  })

  if (profileDetail) {
    const roleInfo = await Role.findOne({
      _id: profileDetail.role
    })

    profileDetail.roleName = roleInfo.name
  }

  res.render('admin/pages/profile-edit', {
    pageTitle: 'Profile',
    profileDetail: profileDetail
  })
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.account._id

    req.body.updatedBy = req.account._id

    if (req.file) {
      req.body.avatar = req.file.path
    } else {
      delete req.body.avatar
    }

    await AccountAdmin.updateOne(
      {
        _id: id,
        deleted: false
      },
      req.body
    )

    req.flash('success', 'Profile updated successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: error
    })
  }
}

module.exports.changePassword = async (req, res) => {
  res.render('admin/pages/profile-change-password', {
    pageTitle: 'Change Password'
  })
}

module.exports.changePasswordPatch = async (req, res) => {
  try {
    const id = req.account._id

    req.body.updatedBy = req.account._id

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10) // Generate a unique and random salt with 10 cycles of hashing
    req.body.password = await bcrypt.hash(req.body.password, salt) // Hash the password with the generated salt

    await AccountAdmin.updateOne(
      {
        _id: id,
        deleted: false
      },
      req.body
    )

    req.flash('success', 'Password changed successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: error.message || 'An error occurred while changing the password.'
    })
  }
}
