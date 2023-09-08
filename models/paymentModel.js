const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    tx_ref: {
        type: String,
        required: [true, 'tx_ref missing']
    },
    amount: {
        type: Number,
        required: [true, 'amount missing']
    },
    currency: {
        type: String,
        required: [true, 'currency missing'],
        default: 'NGN'
    },
    redirect_url: {
        type: String,
        required: [true, 'redirect_url missing'],
        default: ''
    },
    meta: {
        consumer_id: {
            type: Number,
            required: [true, 'consumer_id missing'],
            default: 23
        },
        consumer_mac: {
            type: String,
            required: [true, 'consumer_mac missing'],
            default: '92a3-912ba-1192a'
        },
    },
    customer: {
        email: {
            type: String,
            required: [true, 'email missing'],
        },
        phonenumber: {
            type: String,
            required: [true, 'phonenumber missing'],
        },
        name: {
            type: String,
            required: [true, 'name missing'],
        },
    },
    customizations: {
        title: {
            type: String,
            required: [true, 'title missing'],
        },
        logo: {
            type: String,
            required: false,
        },
    },
    payment_link: {
        status: {
            type: String,
            default: 'failed'
        },
        message: {
            type: String,
            default: ''
        },
        data: {
            link: {
                type: String,
                default: ''
            }
        }
    },
    payment_status: {
        status: {
            type: String,
            default: ''
        },
        transaction_id : {
            type: String,
            default: ''
        }
    },
    booking_id: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Transaction', paymentSchema)