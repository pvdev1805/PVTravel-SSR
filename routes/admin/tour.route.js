const express = require('express')
const router = express.Router()

const multer = require('multer')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')

const upload = multer({ storage: cloudinaryHelper.storage })

const tourValidate = require('../../validates/admin/tour.validate')

const tourController = require('../../controllers/admin/tour.controller')

router.get('/list', tourController.list)

router.patch('/change-multi', tourController.changeMultiPatch)

router.get('/create', tourController.create)

router.post(
  '/create',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  tourValidate.createPost,
  tourController.createPost
)

router.get('/trash', tourController.trash)

router.patch('/trash/change-multi', tourController.trashChangeMultiPatch)

router.get('/edit/:id', tourController.edit)

router.patch(
  '/edit/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  tourValidate.createPost,
  tourController.editPatch
)

router.patch('/delete/:id', tourController.deletePatch)

router.patch('/undo/:id', tourController.undoPatch)

router.patch('/delete-destroy/:id', tourController.deleteDestroyPatch)

module.exports = router
