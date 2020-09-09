const express = require('express')
const router = express.Router()
const regController = require('../controllers/reg')

router.get('', regController.login)

module.exports = router;