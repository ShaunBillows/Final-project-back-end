const stockSchema = require('../stock/model');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    }, 
    email: {
        type: String,
        unique: true,
        required:true
    },
    pass: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true,
        default: 500
    }, 
    stocks: {
        type: [{
            companyName: {
                type: String,
                required: true
            },
            symbol: {
                type: String, 
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        }],
        default: undefined
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User