const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Please add a name']
    },
    email: {
    type: String,
    required: [true, 'Please add an email'],
    },
    location: {
        type: String,
        required: true
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
    },
    extras: {
        queryParams: {
            bookingId: { type: String },
            meetingId: { type: String },
            tenantId: { type: String },
        },
        tenantUrl: { type: String }
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Booking', bookingSchema)