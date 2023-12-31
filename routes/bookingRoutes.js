const express = require('express')
const router = express.Router()
const { createBooking, updateBooking, getAllBooking, getBooking, deleteBooking } = require('../controllers/bookingController')
const { protect } = require('../middleware/authMiddleware')


router.get('/',  getAllBooking)
router.get('/:id', getBooking)
router.post('/', createBooking)
router.put('/:id', updateBooking)
router.delete('/:id', deleteBooking)

module.exports = router