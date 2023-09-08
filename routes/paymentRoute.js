const express = require('express')
const router = express.Router()
const { 
    makePayment, 
    verifyPayment, 
    getTransactionByBookingId } = require('../controllers/paymentController')

router.post('/', makePayment)
router.get('/verify', verifyPayment)
router.get('/getTransaction', getTransactionByBookingId)

module.exports = router