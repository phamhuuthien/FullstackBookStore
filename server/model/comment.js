const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
