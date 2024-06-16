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
    stars: {
        type: Number,
    },
    ratings: [{
        orderId: {
            type: mongoose.Types.ObjectId,
            ref: "Order"
        },
        userName: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        },
        rating: [{
            content: {
                type: String,
            },
            stars: {
                type: Number,
            }
        }]
    }]
});

module.exports = mongoose.model("Book", bookSchema);
