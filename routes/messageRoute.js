const express = require('express')
const router = express.Router()
const { sendMailJet, sendInBlue } = require('../controllers/messageController')

router.post('/sendMail', sendMailJet)
router.post('/sendInBlue', sendInBlue)

module.exports = router