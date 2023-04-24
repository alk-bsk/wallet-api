const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
    },
    createdDate: {
        type: String,
        default: new Date().toISOString()
    }
})

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;