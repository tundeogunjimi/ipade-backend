const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Please add a name']
    },
    email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: false
    },
    gender: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: [true, 'Please select a date']
    },
    time: {
        type: String,
        required: [true, 'Please select time']
    },
    status: {
        type: String,
        required: false,
        default: 'pending'
    },
    purpose: {
        type: String,
        required: false 
    },
    message: {
        type: String,
        required: false
    },
    tenantId: {
        type: String,
        required: true
    },
    completed: {
        type: String,
        required: true,
        default: false
    },
    meetingType: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Booking', bookingSchema)