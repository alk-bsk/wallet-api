const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const transactionSchema = new mongoose.Schema({
    walletId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    createdDate: {
        type: String,
        default: new Date().toISOString()
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;