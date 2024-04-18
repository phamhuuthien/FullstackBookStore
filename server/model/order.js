const mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        data: ['Pending', 'Delivering', 'Delivered']
    },
    listBooks: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);