const createWalletValidation = (req) => {
    let { name, balance } = req.body;

    if (!name) {
        return "Please provide wallet name";
    }
    if (!balance) {
        return "Please provide wallet balance";
    }
    if (isNaN(balance)) {
        return "Wallet balance should be a number";
    }
    if (Number(balance) < 0) {
        return "Wallet balance should not be nagative";
    }
}

const createTransactionValidation = (amount, description) => {

    if (!amount) {
        return "Please provide amount to deposit or withdraw";
    }
    if (!description) {
        return "Please mention description as deposit or withdraw";
    }
    if (description) {
        let validDescription = ['deposit', 'withdraw'].includes(description.toLowerCase())
        return !validDescription ? "Description should be deposit or withdraw" : null;
    }
    if (isNaN(amount)) {
        return "Amount should be a number";
    }
    if (Number(balance) < 0) {
        return "Amount balance should be a positive number";
    }
}



module.exports = { createWalletValidation, createTransactionValidation }