const express = require('express')
const router = express.Router()

const multer = require('multer')

const cloudinaryHelper = require('../../helpers/cloudinary.helper')

const upload = multer({ storage: cloudinaryHelper.storage })

const profileValidate = require('../../validates/admin/profile.validate')

const profileController = require('../../controllers/admin/profile.controller')

router.get('/edit', profileController.edit)

router.patch('/edit', upload.single('avatar'), profileValidate.editPatch, profileController.editPatch)

router.get('/change-password', profileController.changePassword)

router.patch('/change-password', profileValidate.changePasswordPatch, profileController.changePasswordPatch)

module.exports = router
