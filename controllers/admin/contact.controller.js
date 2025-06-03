const moment = require('moment')
const Contact = require('../../models/contact.model')

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
