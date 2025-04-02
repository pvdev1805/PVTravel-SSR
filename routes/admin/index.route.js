const express = require('express')
const router = express.Router()

const accountRoutes = require('./account.route')

router.use('/account', accountRoutes)

module.exports = router
