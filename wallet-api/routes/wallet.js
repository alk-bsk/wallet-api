const router = require('express').Router();
const Wallet = require('../db/walletSchema');
const Transaction = require('../db/transactionSchema');
const { createWalletValidation, createTransactionValidation } = require('../validations/walletValidation');
const WalletResponse = require('../response/WalletResponse');
const TransactionResponse = require('../response/TransactionResponse');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

//create a wallet
router.post('/', async (req, res) => {

    //validate data before create
    let error = createWalletValidation(req);
    if (error) return res.status(400).send({ message: error });
    let { name, balance } = req.body;
    try {
        const wallet = new Wallet({ name, balance: Number(balance) });
        const savedWallet = await wallet.save();
        res.status(201).send(new WalletResponse(savedWallet._doc));
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
});

//fetch a wallet details
router.get('/:walletId', async (req, res) => {

    const walletId = req.params.walletId;

    try {
        const wallet = await Wallet.findOne({ _id: new ObjectId(walletId) });

        if (wallet) {
            res.status(200).send(new WalletResponse(wallet._doc));
        } else {
            res.status(404).send({ message: "Wallet not found" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
});

//Depositing and withdrawing
router.post('/:walletId/transactions', async (req, res) => {

    const reqWalletId = req.params.walletId;
    const { amount, description } = req.body;
    let error = createTransactionValidation(amount, description);
    if (error) return res.status(400).send({ message: error });
    let session = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        let wallet = await Wallet.findOne({ _id: new ObjectId(reqWalletId) }).session(session);

        if (!wallet) {
            res.status(404).send({ message: "Wallet not found" });
        }

        let walletDoc = wallet._doc;
        let modWallet = null;
        if (description.toLowerCase().includes('deposit')) {
            wallet.balance = walletDoc.balance + Number(amount);
            modWallet = await wallet.save({ session });
        } else if (description.toLowerCase().includes('withdraw')) {
            if (amount > walletDoc.balance) {
                throw new Error("Withdraw amount should be less than total balance");
            }
            wallet.balance = walletDoc.balance - Number(amount);
            modWallet = await wallet.save({ session });
        }

        let walletId = modWallet._doc._id.toString();
        let balance = modWallet._doc.balance;
        const transaction = new Transaction({
            walletId,
            amount,
            balance,
            description
        });
        let transactionData = await transaction.save({ session });
        await session.commitTransaction();
        res.status(200).send(new TransactionResponse(transactionData._doc));
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        res.status(500).send({ message: err.message });
    } finally {
        session.endSession();
    }
});

//fetchTransactionsForWallet
router.get('/:walletId/transactions', async (req, res) => {

    const walletId = req.params.walletId;

    try {
        const transactions = await Transaction.find({ walletId: walletId });

        if (transactions && transactions.length > 0) {
            res.status(200).send([...transactions.map(t => new TransactionResponse(t))]);
        } else {
            res.status(404).send({ message: "Wallet not found" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;