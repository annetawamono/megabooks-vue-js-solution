const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
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
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
})

// Hash password
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err)

            this.password = hash
            next()
        })
    })
})

module.exports = mongoose.model('User', UserSchema)