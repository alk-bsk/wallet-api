module.exports = class WalletResponse {
    constructor(doc) {
        this.id = doc._id.toString();
        this.name = doc.name;
        this.balance = doc.balance;
        this.createdDate = doc.createdDate;
    }

}