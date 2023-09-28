const asyncHandler = require("express-async-handler");
const got = require("got");
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const Transaction = require('../models/paymentModel')
const Booking = require('../models/bookingModel')

const makePayment = asyncHandler(async(req, res) => {

    try {
        const paymentDetails = req.body
        paymentDetails.tx_ref = generateTxRef(12)
        paymentDetails.booking_id = req.query.booking_id
        
        const transaction = await Transaction.findOne({tx_ref: req.body.tx_ref}).exec()
        if (transaction) {
            return res.status(401).send(`tx_ref: ${req.body.tx_ref} exists`)
        }

        const response = await got.post("https://api.flutterwave.com/v3/payments", {
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
        },
        json: paymentDetails,}).json()

        if (response.status === 'success') {
            paymentDetails.payment_link = {
                status: response.status,
                message: response.message,
                data: response.data
            }
            const createdTransaction = await Transaction.create(paymentDetails)
            // console.log(`payment details >>> `, createdTransaction)
            
            return res.status(200).json(createdTransaction)
        }
        
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'payment link failed to create',
            error: err
        })
    }

})


const verifyPayment = asyncHandler(async(req, res) => {
    if (req.query.status === 'successful') {
        const transactionDetails = await Transaction.findOne({tx_ref: req.query.tx_ref});
        const response = await flw.Transaction.verify({id: req.query.transaction_id});

        if (
            response.data.status === "successful"
            && response.data.amount === transactionDetails.amount
            && response.data.currency === "NGN") {
            
            // Success! Confirm the customer's payment
            transactionDetails.payment_status = {
                status: response.data.status,
                transaction_id: response.data.id
            }

            updatedTransaction = await Transaction.findByIdAndUpdate(
                transactionDetails._id,
                { payment_status: transactionDetails.payment_status }
            )

            //update booking to reflect paid status
            const updatedBooking = await Booking.findByIdAndUpdate(
                transactionDetails.booking_id, { status: 'paid'}
            )
            
            response.id = transactionDetails._id
            res.status(200).json(updatedTransaction)
        } else {
            // Inform the customer their payment was unsuccessful
            res.status(500).json({ message: 'payment failed'})
        }
    }
})

const getTransactionByBookingId = asyncHandler(async(req, res) => {
    const booking_id = req.query.booking_id;
    const transaction = await Transaction.findOne({ booking_id })

    if (!transaction) {
        return res.status(401).send(`transaction not found`)
    }

    return res.status(200).json(transaction)
})

const generateTxRef = (length) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

module.exports = {
    makePayment,
    verifyPayment,
    getTransactionByBookingId
}