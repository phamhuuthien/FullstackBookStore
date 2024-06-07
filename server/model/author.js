const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
    },
    email: {
        type: String,
        unique: true,
    },
    description: {
        type: String
    }
});


module.exports = mongoose.model("Author", authorSchema);
