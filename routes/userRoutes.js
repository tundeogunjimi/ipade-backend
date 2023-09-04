const express = require('express')
const router = express.Router()
const { registerUser, loginUser, confirmUser, getMe } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/confirm', confirmUser)
router.get('/me', protect, getMe)

module.exports = router