const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000

// connect to database
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.get('/', (req, res) => {
//     res.send('Hello')
// })

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/booking', require('./routes/bookingRoutes'))
app.use('/api/message', require('./routes/messageRoute'))
app.use('/api/payment', require('./routes/paymentRoute'))
app.use('/api/meeting', require('./routes/meetingRoutes'))

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})