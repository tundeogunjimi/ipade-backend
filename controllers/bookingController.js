const asyncHandler = require('express-async-handler')

const Booking = require('../models/bookingModel')

const getAllBooking = asyncHandler(async(req, res) => {

    if (!req.query.email || !req.query.tenantId) {
        res.status(401)
        throw new Error('Booking not found')
    }

    const bookings = await Booking.find({
        email: req.query.email, 
        tenantId: req.query.tenantId
    })

    res.status(200).json(bookings)
})


const getBooking = asyncHandler(async(req, res) => {

    if (!req.params.id || !req.query.tenantId) {
        res.status(401)
        throw new Error('Booking not found')
    }

    const booking = await Booking.findById(req.params.id).exec()

    res.status(200).json(booking)
})


const createBooking = asyncHandler(async(req, res) => {
    const { 
        name, email, gender, mobile, date, time,
        status, purpose, message, tenantId, completed, meetingType,
    } = req.body

    // if (!name || !email) {
    //     res.status(400)
    //     throw new Error('Please include all required fields')
    // }
    
    const errors = validateFormInput(req.body)
    if (errors.status === 'invalid')  return res.status(400).json(errors)

    const booking = await Booking.create({
        name,
        email,
        gender, 
        mobile, 
        date, 
        time,
        status, 
        purpose, 
        message, 
        tenantId, 
        completed, 
        meetingType,
    })

    if (booking) {
        const createdBooking = {
            _id: booking._id,
            name: booking.name,
            email: booking.email,
            gender: booking.gender, 
            mobile: booking.mobile, 
            date: booking.date, 
            time: booking.time,
            status: booking.status, 
            purpose: booking.purpose, 
            message: booking.message, 
            tenantId: booking.tenantId, 
            completed: booking.completed, 
            meetingType: booking.meetingType,
        }
        res.status(201).json(createdBooking)
    } else {
        res.status(400)
        throw new Error('Invalid booking data')
    }
})

const updateBooking = asyncHandler(async(req, res) => {
    
    if (!req.params.id || !req.query.tenantId) {
        res.status(401)
        throw new Error('Booking not found')
    }

    const errors = validateFormInput(req.body)
    if (errors.status === 'invalid')  return res.status(400).json(errors)

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()

    res.status(200).json(updatedBooking)
})


const deleteBooking = asyncHandler(async(req, res) => {

    if (!req.params.id || !req.query.tenantId) {
        res.status(401)
        throw new Error('Booking not found')
    }

    await Booking.findByIdAndDelete(req.params.id)

    res.status(200).json({success: true})
})

validateFormInput = (booking) => {
    const formErrors = {}

    if (booking.name.length < 6) formErrors.name = `Name must be at least 6 characters long`

    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (!emailRegex.test(booking.email)) formErrors.email = 'Enter a valid email address'

    if(!booking.mobile) formErrors.mobile = 'Enter a valid phone number'

    if(!booking.date) formErrors.date = 'Select a date'
    if(!booking.time) formErrors.time = 'Select a time'

    if (
        formErrors.name || formErrors.email
        || formErrors.date || formErrors.time
        ) formErrors.status = 'invalid'

    
    
    return formErrors
}


module.exports = {
    getAllBooking,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
}