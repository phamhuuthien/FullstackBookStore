const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    totalLike: {
        type: Number,
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: "Author"
    },
    slug: {
        type: String,
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Book", bookSchema);
