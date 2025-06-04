const moment = require('moment')
const Contact = require('../../models/contact.model')
const AccountAdmin = require('../../models/account-admin.model')

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }

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

  // Search by keyword
  if (req.query.keyword) {
    const keyword = req.query.keyword
    const keywordRegex = new RegExp(keyword, 'i')

    find.email = keywordRegex
  }
  // End - Search by keyword

  // Pagination
  const limitItems = 4
  let page = 1
  if (req.query.page) {
    const currentPage = parseInt(req.query.page)
    if (currentPage > 0) {
      page = currentPage
    }
  }
  const totalRecord = await Contact.countDocuments(find)
  const totalPage = Math.ceil(totalRecord / limitItems)
  const skip = (page - 1) * limitItems
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  }
  // End - Pagination

  const contactList = await Contact.find(find)
    .sort({
      createdAt: 'desc'
    })
    .limit(limitItems)
    .skip(skip)

  contactList.forEach((item) => {
    item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
  })

  res.render('admin/pages/contact-list', {
    pageTitle: 'Contact List',
    contactList: contactList,
    pagination: pagination
  })
}

module.exports.deletePatch = async (req, res) => {
  try {
    const { id } = req.params

    await Contact.updateOne(
      {
        _id: id,
        deleted: false
      },
      {
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: new Date()
      }
    )

    req.flash('success', 'Contact has been deleted successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Error: Failed to delete contact!'
    })
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { ids, option } = req.body

    switch (option) {
      case 'delete':
        await Contact.updateMany(
          {
            _id: { $in: ids },
            deleted: false
          },
          {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: new Date()
          }
        )

        req.flash('success', 'Contacts have been deleted successfully!')
        break
    }

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Error: Failed to process requests!'
    })
  }
}

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }

  // Search by keyword
  if (req.query.keyword) {
    const { keyword } = req.query
    const keywordRegex = new RegExp(keyword, 'i')

    find.email = keywordRegex
  }
  // End - Search by keyword

  // Pagination
  const limitItems = 4
  let page = 1
  if (req.query.page) {
    const currentPage = parseInt(req.query.page)
    if (currentPage > 0) {
      page = currentPage
    }
  }

  const totalRecord = await Contact.countDocuments(find)
  const totalPage = Math.ceil(totalRecord / limitItems)
  const skip = (page - 1) * limitItems
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  }
  // End - Pagination

  const contactList = await Contact.find(find)
    .sort({
      deletedAt: 'desc'
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of contactList) {
    const infoAccountDeleted = await AccountAdmin.findOne({
      _id: item.deletedBy
    })
    item.deletedByFullName = infoAccountDeleted.fullName

    item.deletedAtFormat = moment(item.deletedAt).format('HH:mm - DD/MM/YYYY')
  }

  res.render('admin/pages/contact-trash', {
    pageTitle: 'Contact Trash',
    contactList: contactList,
    pagination: pagination
  })
}

module.exports.trashChangeMultiPatch = async (req, res) => {
  try {
    const { ids, option } = req.body

    switch (option) {
      case 'undo':
        await Contact.updateMany(
          {
            _id: { $in: ids }
          },
          {
            $set: {
              deleted: false
            },
            $unset: {
              deletedBy: '',
              deletedAt: ''
            }
          }
        )

        req.flash('success', 'Contacts have been restored successfully!')
        break
      case 'delete-destroy':
        await Contact.deleteMany({
          _id: { $in: ids }
        })

        req.flash('success', 'Contacts have been deleted permanently!')
        break
    }

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Error: Failed to process requests!'
    })
  }
}

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id

    await Contact.updateOne(
      {
        _id: id
      },
      {
        $set: {
          deleted: false
        },
        $unset: {
          deletedBy: '',
          deletedAt: ''
        }
      }
    )

    req.flash('success', 'Contact has been restored successfully!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Error: Failed to restore contact!'
    })
  }
}

module.exports.deleteDestroyPatch = async (req, res) => {
  try {
    const id = req.params.id

    await Contact.deleteOne({
      _id: id
    })

    req.flash('success', 'Contact has been deleted permanently!')

    res.status(200).json({
      code: 'success'
    })
  } catch (error) {
    res.status(500).json({
      code: 'error',
      message: 'Error: Failed to delete contact permanently!'
    })
  }
}
