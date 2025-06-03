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
