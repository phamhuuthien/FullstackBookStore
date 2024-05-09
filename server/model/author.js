const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    biography: {
        type: String,
    },
    image: {
        type: String,
    },
    nationality: {
        type: String,
    },
    birthDate: {
        type: Date,
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    slug: {
        type: String,
    }
});


module.exports = mongoose.model("Author", authorSchema);
