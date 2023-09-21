const express = require('express')
const router = express.Router()
const { sendMailJet, sendInBlue, shareMeetingLink } = require('../controllers/messageController')

router.post('/sendMail', sendMailJet)
router.post('/sendInBlue', sendInBlue)
router.post('/shareMeetingLink', shareMeetingLink)

module.exports = router