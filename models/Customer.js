const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    bookDescription: {
        type: String,
        required: true,
        trim: true
    },
    bookPrice: {
        type: Number,
        default: 0.0
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    isbn: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Customer', CustomerSchema)