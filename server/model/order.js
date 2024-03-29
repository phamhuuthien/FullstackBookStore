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
        default: 'Pending'
    },
    total: {
        type: Number
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);