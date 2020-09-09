const express = require('express')
const router = express.Router()
const regController = require('../controllers/reg')

router.get('', regController.registerGet)

router.post('', regController.registerPost)

module.exports = router;
