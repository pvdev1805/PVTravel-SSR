const express = require('express')
const router = express.Router()

const multer = require('multer')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')

const upload = multer({ storage: cloudinaryHelper.storage })

const tourValidate = require('../../validates/admin/tour.validate')

const tourController = require('../../controllers/admin/tour.controller')

router.get('/list', tourController.list)

router.get('/create', tourController.create)

router.post('/create', upload.single('avatar'), tourValidate.createPost, tourController.createPost)

router.get('/trash', tourController.trash)

router.get('/edit/:id', tourController.edit)

router.patch('/edit/:id', upload.single('avatar'), tourValidate.createPost, tourController.editPatch)

module.exports = router
