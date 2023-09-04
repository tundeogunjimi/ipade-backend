const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
        name, email, gender, mobile, appointmentDate, appointmentTime,
        status, purpose, message, tenantId, completed, meetingType,
    } = req.body

    if (!name || !email) {
        res.status(400)
        throw new Error('Please include all required fields')
    }

    const booking = await Booking.create({
        name,
        email,
        gender, 
        mobile, 
        appointmentDate, 
        appointmentTime,
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
            appointmentDate: booking.appointmentDate, 
            appointmentTime: booking.appointmentTime,
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


module.exports = {
    getAllBooking,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
}