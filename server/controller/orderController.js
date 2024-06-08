const Order = require('../model/order');
const User = require("../model/user");
const Coupon = require("../model/coupon");
const getOrder = async (req, res) => {
  try {
    const { oid } = req.params;
    const orders = await Order.findOne({ _id: oid });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllOrderByUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const orders = await Order.find({ userId: _id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

const addOrder = async (req, res) => {
  const { _id } = req.user;
  const { coupon, total, address } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.book", "name price");

  if (userCart.cart.length == 0) {
    return res.status(404).json({ message: "cart null" });
  }

  const books = userCart?.cart?.map((el) => ({
    bookId: el.book._id,
    quantity: el.quantity,
  }));

  if (!coupon) {
    coupon = null;
  }
  const dataOrder = {
    userId: _id,
    listBooks: books,
    couponId: coupon,
    total: total,
    address: address,
  };

  const saveOrder = await Order.create(dataOrder);
  await User.findByIdAndUpdate(_id, { $set: { cart: [] } });
  // res.status(200).json({ success: saveOrder ? true : false });
  if (saveOrder) {
    res.redirect("/");
  }
};

const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.oid,
      {
        $set: { status: req.body.status },
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getOrder,
  getAllOrder,
  addOrder,
  updateOrder,
  getAllOrderByUser,
};