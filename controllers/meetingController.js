const asyncHandler = require('express-async-handler')

const Meeting = require('../models/meetingModel')

const createMeeting = asyncHandler(async(req, res) => {

    const errors = validateFormInput(req.body)
    if (errors.status === 'invalid') return res.status(400).json(errors)

    const meeting = await Meeting.create({...req.body})

    if (meeting) {
        const createdMeeting = {
            id: meeting._id,
            name: meeting.name,
            dateRange: meeting.dateRange,
            desc: meeting.desc,
            link: meeting.link,
            location: meeting.location,
            address: meeting.address,
            price: meeting.price,
            tenantId: meeting.tenantId,
            isFree: meeting.isFree
        }
        res.status(201).json(createdMeeting)
    } else {
        res.status(400)
        throw new Error('Invalid meeting data')
    }
})

const getAllMeetings = asyncHandler(async(req, res) => {
    if(!req.query.tenantId) {
        res.status(401)
        throw new Error('You are not authorized to view meetings')
    }

    const meetings = await Meeting.find({
        tenantId: req.query.tenantId
    }).sort('field -updatedAt')

    res.status(200).json(meetings)
})

const getMeeting = asyncHandler(async(req, res) => {

    console.log(`view req >>> `, req.params)

    if(!req.params.id || !req.query.tenantId) {
        res.status(401)
        throw new Error('Error: meeting with not fetched')
    }

    const meeting = await Meeting.findOne({
        tenantId: req.query.tenantId, 
        _id: req.query.meetingId
    })

    res.status(200).json(meeting)
})


const updateMeeting = asyncHandler(async(req, res) => {
    if (!req.params.id || req.params.tenantId) {
        res.status(401)
        throw new Error('Not authorized')
    }

    const errors = validateFormInput(req.body)
    if (errors.status === 'invalid')  return res.status(400).json(errors)

    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {new: true})

    if(Object.keys(updatedMeeting).length === 0) {
        res.status(401)
        throw new Error('Meeting not updated')
    }
    res.status(200).json(updatedMeeting)

})

const deleteMeeting = asyncHandler(async(req, res) => {

    if (!req.params.id) {
        res.status(401)
        throw new Error('Not authorized')
    }

    await Meeting.findByIdAndDelete(req.params.id)

    res.status(200).json({success: true})
})

// form validation
validateFormInput = (meeting) => {
    const formErrors = {}

    if (meeting.name.length < 6) formErrors.name = `Name must be at least 6 characters long`

    if (!meeting.link) formErrors.link = 'Link not created'
    if (!meeting.duration) formErrors.duration = 'Select a duration'
    if (!meeting.location) formErrors.location = 'Select a location'
    if (!meeting.dateRange.start || !meeting.dateRange.end) formErrors.dateRange = 'Select date range'
    if (!meeting.price) formErrors.price = 'Price not valid'
    if (!meeting.tenantId) formErrors.tenantId = 'Tenant id not valid'

    if (formErrors.name || formErrors.duration || formErrors.location
        ||formErrors.dateRange || formErrors.link || formErrors.price 
        || formErrors.tenantId) {
        formErrors.status = 'invalid'
    }
    return formErrors
}


module.exports = {
    createMeeting,
    getAllMeetings,
    updateMeeting,
    deleteMeeting,
    getMeeting
}