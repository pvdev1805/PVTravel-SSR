const Contact = require('../../models/contact.model')

module.exports.createPost = async (req, res) => {
  const { email } = req.body

  const existedContact = await Contact.findOne({
    email: email,
    deleted: false
  })

  if (existedContact) {
    res.status(400).json({
      code: 'error',
      message: 'Error: Email has already been registered previously!'
    })
    return
  }

  const newRecord = new Contact(req.body)
  await newRecord.save()

  req.flash('success', 'Thank you for signing up for our newsletter!')

  res.status(200).json({
    code: 'success'
  })
}
