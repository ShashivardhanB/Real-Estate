const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const otpSchema = new mongoose.Schema({

    // userId: {
    //     type: ObjectId,
    //     ref: 'User',
    //     required: true,
    //     trim: true
    // },

    phone: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: 300
        }
    }



}, {
    timestamps: true
})


module.exports = mongoose.model('Otp', otpSchema)