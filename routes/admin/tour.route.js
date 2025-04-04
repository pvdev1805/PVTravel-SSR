const express = require('express')
const router = express.Router()

const tourController = require('../../controllers/admin/tour.controller')

router.get('/list', tourController.list)

module.exports = router
