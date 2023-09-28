const asyncHandler = require('express-async-handler')

const Booking = require('../models/bookingModel')
const Meeting = require('../models/meetingModel')

const { sendMeetingDetails } = require('./messageController')

const getAllBooking = asyncHandler(async(req, res) => {

    if (!req.query.email || !req.query.tenantId) {
        res.status(401)
        throw new Error('Booking not found')
    }

    const bookings = await Booking.find({
        // email: req.query.email, 
        tenantId: req.query.tenantId
    })

    let fetchedBookings = []

    bookings.forEach(booking => {
        const bookingToAdd = {
            id: booking._id,
            name: booking.name,
            email: booking.email,
            date: booking.date, 
            time: booking.time,
            status: booking.status, 
            location: booking.location, 
            message: booking.message, 
            tenantId: booking.tenantId, 
            completed: booking.completed, 
            meetingType: booking.meetingType,
        }
        fetchedBookings.push(bookingToAdd)
    })

    res.status(200).json(fetchedBookings)
})


const getBooking = asyncHandler(async(req, res) => {

    if (!req.params.id || !req.query.tenantId) {
        res.status(401)
        throw new Error('Booking not found')
    }

    const booking = await Booking.findById(req.params.id).exec()

    const foundBooking = {
        id: booking._id,
        name: booking.name,
        email: booking.email,
        date: booking.date, 
        time: booking.time,
        status: booking.status, 
        location: booking.location, 
        message: booking.message, 
        tenantId: booking.tenantId, 
        completed: booking.completed, 
        meetingType: booking.meetingType,
    }

    res.status(200).json(foundBooking)
})


const createBooking = asyncHandler(async(req, res) => {
    const { 
        name, email, date, time, location,
        status, message, tenantId, completed, meetingType,
    } = req.body
    
    const errors = validateBody(req.body)
    if (errors.status === 'invalid')  return res.status(400).json(errors)

    const booking = await Booking.create({
        name,
        email,
        date, 
        time,
        status, 
        location, 
        message, 
        tenantId, 
        completed, 
        meetingType,
    })

    if (booking) {
        const createdBooking = {
            id: booking._id,
            name: booking.name,
            email: booking.email,
            date: booking.date, 
            time: booking.time,
            status: booking.status, 
            location: booking.location, 
            message: booking.message, 
            tenantId: booking.tenantId, 
            completed: booking.completed, 
            meetingType: booking.meetingType,
        }
        const meeting = await Meeting.findById(req.body.extras.queryParams.meetingId)
        sendMeetingDetails(createdBooking, meeting, 'create')
        res.status(201).json(createdBooking)
    } else {
        res.status(400)
        throw new Error('Invalid booking data')
    }
})

const updateBooking = asyncHandler(async(req, res) => {
    // console.log(req.query, req.params, req.body.extras)
    
    if (!req.params.id || !req.query.tenantId) {
        res.status(401)
        throw new Error('Booking not found')
    }

    const errors = validateBody(req.body)
    if (errors.status === 'invalid')  return res.status(400).json(errors)

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
    const meeting = await Meeting.findById(req.body.extras.queryParams.meetingId)
    // console.log(`meeting found >>> `, meeting, req.body.extras.queryParams.meetingId)
    sendMeetingDetails(updatedBooking, meeting, 'update')
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

// Validation 
validateBody = (booking) => {
    const formErrors = {}

    if (booking.name.length < 6) formErrors.name = `Name must be at least 6 characters long`

    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (!emailRegex.test(booking.email)) formErrors.email = 'Enter a valid email address'

    // if(!booking.mobile) formErrors.mobile = 'Enter a valid phone number'

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