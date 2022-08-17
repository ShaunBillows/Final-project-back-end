const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
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
});

const Stock = mongoose.model('stock', stockSchema);

module.exports = {Stock};