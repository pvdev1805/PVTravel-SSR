const express = require('express')
const router = express.Router()

const categoryController = require('../../controllers/admin/category.controller')

router.get('/list', categoryController.list)

module.exports = router
