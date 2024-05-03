const Order = require('../model/order');

const getOrder = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const orders = await Order.find({ userId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
}

const addOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.oid, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.oid);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { getOrder, getAllOrder, addOrder, updateOrder, deleteOrder };