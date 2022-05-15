const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

   
    password: {
        type: String,
        trim: true
    },
    isPhoneverified: {
        type: Boolean,
        default: false
    },
   

}, {
    timestamps: true
})


module.exports = mongoose.model('User', userSchema)