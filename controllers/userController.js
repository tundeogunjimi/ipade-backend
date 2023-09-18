const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const { sendInBlue } = require('./messageController')

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
    const confirmationToken = await bcrypt.hash(email, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        confirmationToken,
        // custom_url: '' // todo: 
    })

    if (user) {
        const createdUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            confirmationToken: user.confirmationToken
        }
        // send email with attached confirmation token to user
        sendInBlue(createdUser)
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
    if (!user || user.isActive === false) {
        res.status(401).json({ message: 'Account not found or inactive'})
    }

    // Check user and passwords match
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

/**
 *
 * @desc Confirm registered user
 * @route /api/users/confirm
 * @access Public
 */
const confirmUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.query.id).select('-password')

    if(!user) {
        return res.status(500).json({ status: false, message: 'user not found! Please contact support'}) 
    }

    if (req.query.token === user.confirmationToken) {
        user.isActive = true
        const confirmedUser = await User.findByIdAndUpdate(user.id, user, {new: true})
        return res.status(200).json({ status: true, message: 'user confirmed'})
    }
    return res.status(500).json({ status: false, message: 'user confirmation failed'})

    // const token = req.query.token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // const user = await User.findById(decoded.id).select('-password')
    // console.log(`req params >>> `, req.query, decoded, user)

    // user.isActive = true
    // const confirmedUser = await User.findByIdAndUpdate(user.id, user, {new: true})
    
    // res.status(200).json(confirmedUser)
})

const updateProfile = asyncHandler(async(req, res) => {
    const { id, email, } = req.body

    if(!email || !id) {
        res.status(400)
        throw new Error('User not found')
    }

    const user = await User.findOne({email, _id: id})

    if (user) {
        const updateValues = {name: req.body.name, bio: req.body.bio}
        const updatedUser = await User.findByIdAndUpdate(user.id, updateValues)
        const returnValue = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio,
        }
        return res.status(200).json(returnValue)
    }

    return res.status(500).json({message: 'Profile not updated'})
})

const uploadProfilePicture = asyncHandler(async(req, res) => {

    const { id, email, } = req.body.user

    if(!email || !id) {
        res.status(400)
        throw new Error('User not found')
    }

    const user = await User.findOne({email, _id: id})

    if (user) {
        const updateValues = {profilePicture: req.body.user.profilePicture}
        const updatedUser = await User.findByIdAndUpdate(user.id, updateValues)
        return res.status(200).json({message: true})
    }
    console.log(req.body)
})

const deleteProfile = asyncHandler(async(req, res) => {

    if(!req.query.email || !req.query.id) {
        res.status(400)
        throw new Error('User not found')
    }

    const user = await User.findOne({
        email: req.query.email,
        _id: req.query.id
    })

    if (user) {
        await User.findByIdAndDelete(user._id)
        return res.status(200).json({success: 'Profile successfully deleted'})
    }

    return res.status(500).json({error: 'Profile not deleted'})
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
        name: req.user.name,
        bio: req.user.bio
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
    updateProfile,
    deleteProfile,
    uploadProfilePicture
}