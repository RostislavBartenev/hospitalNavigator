const express = require('express')
const router = express.Router()
const regController = require('../controllers/reg')

router.route('')
.get(regController.registerGet)
.post(regController.registerPost)

module.exports = router;
