const bcrypt = require('bcryptjs')
const moment = require('moment')
const slugify = require('slugify')

const SettingWebsiteInfo = require('../../models/setting-website-info.model')
const Role = require('../../models/role.model')
const AccountAdmin = require('../../models/account-admin.model')

const permissionConfig = require('../../config/permission')
const Promotion = require('../../models/promotion.model')

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
  const find = {
    deleted: false
  }

  const roleList = await Role.find({
    deleted: false
  })

  // Filter by status
  if (req.query.status) {
    find.status = req.query.status
  }
  // End - Filter by status

  // Filter by createdAt
  const dateFilter = {}
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf('day').toDate()
    dateFilter.$gte = startDate
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).startOf('day').toDate()
    dateFilter.$lte = endDate
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter
  }
  // End - Filter by createdAt

  // Filter by role
  if (req.query.role) {
    find.role = req.query.role
  }
  // End - Filter by role

  // Filter by keyword - Search
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    })
    const keywordRegex = new RegExp(keyword)
    find.slug = keywordRegex
  }
  // End - Filter by keyword - Search

  // Pagination
  const limitItems = 5
  let page = 1
  if (req.query.page) {
    const currentPage = parseInt(req.query.page)
    if (currentPage > 0) {
      page = currentPage
    }
  }
  const totalRecord = await AccountAdmin.countDocuments(find)
  const totalPage = Math.ceil(totalRecord / limitItems)
  const skip = (page - 1) * limitItems
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  }
  // End - Pagination

  const accountAdminList = await AccountAdmin.find(find)
    .sort({
      createdAt: 'desc'
    })
    .skip(skip)
    .limit(limitItems)

  for (const item of accountAdminList) {
    if (item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role
      })

      if (roleInfo) {
        item.roleName = roleInfo.name
      }
    }
  }

  res.render('admin/pages/setting-account-admin-list', {
    pageTitle: 'Admin Account List',
    accountAdminList: accountAdminList,
    roleList: roleList,
    pagination: pagination
  })
}

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({
    deleted: false
  })

  res.render('admin/pages/setting-account-admin-create', {
    pageTitle: 'Create Admin Account',
    roleList: roleList
  })
}

module.exports.accountAdminCreatePost = async (req, res) => {
  try {
    req.body.createdBy = req.account._id
    req.body.updatedBy = req.account._id
    req.body.avatar = req.file ? req.file.path : ''

    const existAccount = await AccountAdmin.findOne({
      email: req.body.email
    })

    if (existAccount) {
      res.status(409).json({
        code: 'error',
        message: 'Email already exists!'
      })
      return
    }

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10) // Generate a unique and random salt with 10 cycles of hashing
    req.body.password = await bcrypt.hash(req.body.password, salt) // Hash the password with the salt

    const newAccount = new AccountAdmin(req.body)
    await newAccount.save()

    req.flash('success', 'Create admin account successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      code: 'error',
      message: 'Failed to create admin account'
    })
  }
}

module.exports.accountAdminEdit = async (req, res) => {
  try {
    const id = req.params.id

    const accountAdminDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    })

    const roleList = await Role.find({
      deleted: false
    })

    res.render('admin/pages/setting-account-admin-edit', {
      pageTitle: 'Edit Admin Account',
      accountAdminDetail: accountAdminDetail,
      roleList: roleList
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Admin account does not exist or has been deleted'
    })

    res.redirect(`/${pathAdmin}/setting/account-admin/list`)
  }
}

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const id = req.params.id

    req.body.updatedBy = req.account._id

    if (req.file) {
      req.body.avatar = req.file.path
    } else {
      delete req.body.avatar
    }

    // Encrypt password using bcrypt
    if (req.body.password) {
      const salt = bcrypt.genSalt(10) // Generate a unique and random salt with 10 cycles of hashing
      req.body.password = await bcrypt.hash(req.body.password, salt) // Hash the password with the salt
    } else {
      delete req.body.password
    }

    await AccountAdmin.updateOne(
      {
        _id: id,
        deleted: false
      },
      req.body
    )

    req.flash('success', 'Update admin account successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Admin account does not exist or has been deleted'
    })
    res.redirect(`/${pathAdmin}/setting/account-admin/list`)
  }
}

module.exports.accountAdminDeletePatch = async (req, res) => {
  try {
    const id = req.params.id

    await AccountAdmin.updateOne(
      {
        _id: id
      },
      {
        deleted: true,
        deletedAt: Date.now(),
        deletedBy: req.account._id
      }
    )

    req.flash('success', 'Delete admin account successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Admin account does not exist or has been deleted'
    })
  }
}

module.exports.accountAdminChangeMultiPatch = async (req, res) => {
  try {
    const { ids, option } = req.body

    switch (option) {
      case 'active':
      case 'inactive':
        await AccountAdmin.updateMany(
          {
            _id: { $in: ids }
          },
          {
            status: option
          }
        )
        req.flash('success', 'Update admin account status successfully!')
        break
      case 'delete':
        await AccountAdmin.updateMany(
          {
            _id: { $in: ids }
          },
          {
            deleted: true,
            deletedAt: Date.now(),
            deletedBy: req.account._id
          }
        )
        req.flash('success', 'Delete admin account successfully!')
        break
    }

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      code: 'error',
      message: 'Failed to update admin account!'
    })
  }
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

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    })

    res.render('admin/pages/setting-role-edit', {
      pageTitle: 'Edit Role',
      roleDetail: roleDetail,
      permissionList: permissionConfig.permissionList
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Role does not exist or has been deleted'
    })
    res.redirect(`/${pathAdmin}/setting/role/list`)
  }
}

module.exports.roleEditPatch = async (req, res) => {
  try {
    const id = req.params.id

    req.body.updatedBy = req.account._id

    await Role.updateOne(
      {
        _id: id,
        deleted: false
      },
      req.body
    )

    req.flash('success', 'Update role successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      code: 'error',
      message: 'Role does not exist or has been deleted'
    })
    res.redirect(`/${pathAdmin}/setting/role/list`)
  }
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

module.exports.roleChangeMultiPatch = async (req, res) => {
  try {
    const { ids, option } = req.body

    switch (option) {
      case 'delete':
        await Role.updateMany(
          {
            _id: { $in: ids }
          },
          {
            deleted: true,
            deletedAt: Date.now(),
            deletedBy: req.account._id
          }
        )

        req.flash('success', 'Delete role successfully!')

        break
    }

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Failed to delete role!'
    })
  }
}

module.exports.uiList = async (req, res) => {
  res.render('admin/pages/setting-ui-list', {
    pageTitle: 'UI Management'
  })
}

module.exports.promotion = async (req, res) => {
  const promotionDetail = await Promotion.findOne({})

  if (promotionDetail) {
    const formattedDate = moment(promotionDetail.promotionExpiredDate).format('YYYY-MM-DD')
    promotionDetail.formattedDate = formattedDate
  }

  res.render('admin/pages/setting-promotion', {
    pageTitle: 'Promotion',
    promotionDetail: promotionDetail
  })
}

module.exports.promotionPatch = async (req, res) => {
  try {
    const promotion = await Promotion.findOne({})

    if (!promotion) {
      req.body.createdBy = req.account._id
      req.body.updatedBy = req.account._id

      req.body.maxDiscountAmount = parseFloat(req.body.maxDiscountAmount).toFixed(2)

      const newPromotion = new Promotion(req.body)
      await newPromotion.save()
    } else {
      req.body.maxDiscountAmount = parseFloat(req.body.maxDiscountAmount).toFixed(2)
      req.body.updatedBy = req.account._id
      await Promotion.updateOne(
        {
          _id: promotion._id
        },
        req.body
      )
    }

    req.flash('success', 'Update promotion successfully!')
    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      code: 'error',
      message: 'Failed to update promotion!'
    })
  }
}
