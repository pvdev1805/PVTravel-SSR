const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/admin/order.controller')

router.get('/list', orderController.list)

module.exports = router
