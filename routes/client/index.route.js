const express = require('express')
const router = express.Router()

const homeRoutes = require('./home.route')
const tourRoutes = require('./tour.route')

router.use('/', homeRoutes)
router.use('/tours', tourRoutes)

module.exports = router
