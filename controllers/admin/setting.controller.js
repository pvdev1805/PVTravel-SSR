const SettingWebsiteInfo = require('../../models/setting-website-info.model')
const Role = require('../../models/role.model')

const permissionConfig = require('../../config/permission')

module.exports.list = async (req, res) => {
  res.render('admin/pages/setting-list', {
    pageTitle: 'Settings'
  })
}

module.exports.websiteInfo = async (req, res) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({})

  res.render('admin/pages/setting-website-info', {
    pageTitle: 'Website Info',
    settingWebsiteInfo: settingWebsiteInfo
  })
}

module.exports.websiteInfoPatch = async (req, res) => {
  try {
    if (Object.keys(req.files).length > 0) {
      if (req.files.logo) {
        req.body.logo = req.files.logo[0].path
      } else {
        delete req.body.logo
      }

      if (req.files.favicon) {
        req.body.favicon = req.files.favicon[0].path
      } else {
        delete req.body.favicon
      }
    } else {
      delete req.body.logo
      delete req.body.favicon
    }

    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({})
    if (!settingWebsiteInfo) {
      const newRecord = new SettingWebsiteInfo(req.body)
      await newRecord.save()
    } else {
      await SettingWebsiteInfo.updateOne(
        {
          _id: settingWebsiteInfo._id
        },
        req.body
      )
    }

    req.flash('success', 'Update website info successfully!')

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
  const roleList = await Role.find({
    deleted: false
  })

  res.render('admin/pages/setting-role-list', {
    pageTitle: 'Role List',
    roleList: roleList
  })
}

module.exports.roleCreate = async (req, res) => {
  res.render('admin/pages/setting-role-create', {
    pageTitle: 'Create Role',
    permissionList: permissionConfig.permissionList
  })
}

module.exports.roleCreatePost = async (req, res) => {
  req.body.createdBy = req.account._id
  req.body.updatedBy = req.account._id

  const newRecord = new Role(req.body)

  await newRecord.save()

  req.flash('success', 'Create role successfully!')

  res.status(200).json({
    code: 'success'
  })
}

module.exports.roleDeletePatch = async (req, res) => {
  try {
    const id = req.params.id

    await Role.updateOne(
      {
        _id: id
      },
      {
        deleted: true,
        deletedAt: Date.now(),
        deletedBy: req.account._id
      }
    )

    req.flash('success', 'Delete role successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      code: 'error',
      message: 'Role does not exist or has been deleted'
    })
  }
}
