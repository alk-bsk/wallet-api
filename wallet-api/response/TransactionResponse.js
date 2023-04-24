module.exports = class TransactionResponse {
    constructor(doc) {
        this.id = doc._id.toString();
        this.walletId = doc.walletId;
        this.amount = doc.amount;
        this.balance = doc.balance;
        this.description = doc.description;
        this.createdDate = doc.createdDate;
    }

}