const express = require('express')
const router = express.Router()

const contactValidate = require('../../validates/client/contact.validate')

const contactController = require('../../controllers/client/contact.controller')

router.post('/create', contactValidate.createPost, contactController.createPost)

module.exports = router
