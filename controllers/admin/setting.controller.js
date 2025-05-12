const SettingWebsiteInfo = require('../../models/setting-website-info.model')

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
  res.render('admin/pages/setting-role-list', {
    pageTitle: 'Role List'
  })
}

module.exports.roleCreate = async (req, res) => {
  res.render('admin/pages/setting-role-create', {
    pageTitle: 'Create Role'
  })
}
