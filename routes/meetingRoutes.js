const express = require('express')
const router = express.Router()
const { 
    createMeeting, 
    getAllMeetings, 
    getMeeting, 
    updateMeeting, 
    deleteMeeting,
    getMeetingsByUsername
} = require('../controllers/meetingController')

const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createMeeting)
router.get('/', protect, getAllMeetings)
router.get('/:username', getMeetingsByUsername)
router.get('/i/:id', getMeeting)
router.put('/:id', protect, updateMeeting)
router.delete('/:id', protect, deleteMeeting)

module.exports = router