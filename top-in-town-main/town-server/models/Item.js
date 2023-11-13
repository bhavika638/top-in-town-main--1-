const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    category: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    }
})

module.exports = mongoose.model('Item', ItemSchema);