const express = require('express')
const router = express.Router()
const { sendInBlue, shareMeetingLink } = require('../controllers/messageController')

router.post('/sendInBlue', sendInBlue)
router.post('/shareMeetingLink', shareMeetingLink)

module.exports = router