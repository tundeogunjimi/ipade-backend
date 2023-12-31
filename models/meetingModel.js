const mongoose = require('mongoose')

const meetingSchema = mongoose.Schema({
    dateRange: {
        start: {type: String},
        end: {type: String}
    },
    desc: {
        type: String,
    },
    link: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    address: {
        type: String,
    },
    duration: {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    resumptionTime: {
        type: String,
        required: true
    },
    closingTime: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true,
    },
    isFree: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true,
})

module.exports = mongoose.model('Meeting', meetingSchema)