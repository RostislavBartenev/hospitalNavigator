const express = require('express')
const router = express.Router()
const logController = require('../controllers/log')

router.route('')
.get(logController.loginGet)
.post(logController.loginPost)

module.exports = router;
