const express = require('express')
const router = express.Router()

const contactController = require('../../controllers/admin/contact.controller')

router.get('/list', contactController.list)

router.patch('/delete/:id', contactController.deletePath)

module.exports = router
