const moment = require('moment')
const Contact = require('../../models/contact.model')
const AccountAdmin = require('../../models/account-admin.model')

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }

  const contactList = await Contact.find(find).sort({
    createdAt: 'desc'
  })

  contactList.forEach((item) => {
    item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
  })

  res.render('admin/pages/contact-list', {
    pageTitle: 'Contact List',
    contactList: contactList
  })
}

module.exports.deletePath = async (req, res) => {
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

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }

  const contactList = await Contact.find(find).sort({
    deletedAt: 'desc'
  })

  for (const item of contactList) {
    const infoAccountDeleted = await AccountAdmin.findOne({
      _id: item.deletedBy
    })
    item.deletedByFullName = infoAccountDeleted.fullName

    item.deletedAtFormat = moment(item.deletedAt).format('HH:mm - DD/MM/YYYY')
  }

  res.render('admin/pages/contact-trash', {
    pageTitle: 'Contact Trash',
    contactList: contactList
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
