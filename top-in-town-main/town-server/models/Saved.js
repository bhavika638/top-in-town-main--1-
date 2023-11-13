const mongoose = require('mongoose');

const SavedSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  
});

const Saved = mongoose.model('Saved', SavedSchema);

module.exports = Saved;
