const express = require('express')
const router = express.Router()

const accountRoutes = require('./account.route')
const dashboardRoutes = require('./dashboard.route')

router.use('/account', accountRoutes)

router.use('/dashboard', dashboardRoutes)

module.exports = router
