const express = require('express')
const router = express.Router()
const { makePayment, verifyPayment } = require('../controllers/paymentController')

router.post('/', makePayment)
router.get('/verify', verifyPayment)

module.exports = router