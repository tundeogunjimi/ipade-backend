const express = require('express')
const router = express.Router()
const { 
    registerUser, 
    loginUser, 
    confirmUser, 
    getMe,
    updateProfile,
    deleteProfile,
    uploadProfilePicture
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/confirm', confirmUser)
router.get('/me', protect, getMe)
router.post('/update', protect, updateProfile)
router.post('/upload', protect, uploadProfilePicture)
router.delete('/delete', protect, deleteProfile)

module.exports = router