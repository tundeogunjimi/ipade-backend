const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
   name: {
    type: String,
    required: [true, 'Please add a name']
   },
   email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
   },
   bio: {
    type: String,
    default: 'About '
   },
   password: {
    type: String,
    required: [true, 'Please add a password']
   },
   confirmationToken: {
    type: String
   },
   isAdmin: {
    type: Boolean,
    required: true,
    default: false
   },
   isActive: {
    type: Boolean,
    required: true,
    default: false
   },
   profilePicture: {
    type: String,
    default: 'pending'
   }
}, 
{
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)