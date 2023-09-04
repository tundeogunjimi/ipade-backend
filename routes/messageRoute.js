const express = require('express')
const router = express.Router()
const { sendMail } = require('../controllers/messageController')

router.post('/sendMail', sendMail)

module.exports = router