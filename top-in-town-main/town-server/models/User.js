const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    invoicenumber: String,
    name: String,
    number: String,
    date: String,
    amount: Number,
    json: Object
});


module.exports = mongoose.model('User', UserSchema);
