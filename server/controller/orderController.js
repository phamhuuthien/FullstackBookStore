const Order = require('../model/order');
const User = require("../model/user");
const getOrder = async (req, res) => {
  try {
    const { oid } = req.params;
    const orders = await Order.findOne({ _id: oid })
      .populate("userId", "lastname mobile email")
      .populate("listBooks.bookId", "name image price");
    res.render("Pages/detailOrder", { orders });
  } catch (err) {
    res.status(500).json(err);
  }
};

const addOrder = async (req, res) => {
  const { _id } = req.user;
  var { coupon, total, address } = req.body;

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

  let deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  const dataOrder = {
    userId: _id,
    listBooks: books,
    couponId: coupon,
    total: total,
    address: address,
    deliveryDate,
  };

  const saveOrder = await Order.create(dataOrder);
  await User.findByIdAndUpdate(_id, { $set: { cart: [] } });
  // res.status(200).json({ success: saveOrder ? true : false });
  if (saveOrder) {
    res.redirect("/orderSuccess");
  }
};

const cancelOrder = async (req, res) => {
  const { oid } = req.params;
  const order = await Order.findById(oid);
  if (order.status == "pending") {
    await Order.findByIdAndUpdate(oid, { $set: { status: "cancle" } });
  }
  // const { _id } = req.user;
  // const user = User.findById(_id);
  // const orders = await Order.find({ userId: _id }).populate(
  //   "listBooks.bookId",
  //   "name image"
  // );
  // // res.status(200).json(orders);
  // return res.render("Pages/orderByUser", { orders, user });
  res.redirect("/getAllOrderByUser");
};

const statusOrder = async (req, res) => {
  const { oid } = req.params;
  const { status } = req.query;
  const order = await Order.findById(oid);
  if (order) {
    await Order.findByIdAndUpdate(oid, { $set: { status } });
  }
  return res.redirect("/admin/order")
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
  // getAllOrder,
  addOrder,
  updateOrder,
  // getAllOrderByUser,
  cancelOrder,
  statusOrder,
};