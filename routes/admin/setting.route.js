const express = require('express')
const router = express.Router()

const settingController = require('../../controllers/admin/setting.controller')

router.get('/list', settingController.list)

router.get('/website-info', settingController.websiteInfo)

module.exports = router
