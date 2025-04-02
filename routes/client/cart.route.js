const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/client/cart.controller')

router.get('/', cartController.cart)

module.exports = router
