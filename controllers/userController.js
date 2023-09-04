const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

/**
 *
 * @desc Register a new user
 * @route /api/users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }

    // Find if user already exists
    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    if (user) {
        const createdUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        }
        // send email with attached token to user
        console.log(`user token >>>`, createdUser.token)
        res.status(201).json(createdUser)
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

/**
 *
 * @desc Register a new user
 * @route /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})

    // Check user and passwords match
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
    res.send('Login Route')
})

/**
 *
 * @desc Confirm registered user
 * @route /api/users/confirm
 * @access Public
 */
const confirmUser = asyncHandler(async (req, res) => {
    const token = req.query.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    console.log(`req params >>> `, req.query, decoded, user)

    user.isActive = true
    const confirmedUser = await User.findByIdAndUpdate(user.id, user, {new: true})
    
    res.status(200).json(confirmedUser)
})

/**
 *
 * @desc Get current user
 * @route /api/users/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email, 
        name: req.user.name
    }
    res.status(200).json(user)
})

// Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    confirmUser,
}