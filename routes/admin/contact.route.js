const express = require('express')
const router = express.Router()

const contactController = require('../../controllers/admin/contact.controller')

router.get('/list', contactController.list)

router.patch('/delete/:id', contactController.deletePath)

router.get('/trash', contactController.trash)

router.patch('/trash/change-multi', contactController.trashChangeMultiPatch)

router.patch('/undo/:id', contactController.undoPatch)

router.patch('/delete-destroy/:id', contactController.deleteDestroyPatch)

module.exports = router
