const express = require("express");
const userController = require("../controller/userController");
const authorController = require("../controller/authorController");
const categoryController = require("../controller/categoryController");
const orderController = require("../controller/orderController");
const bookController = require("../controller/bookController");
const couponController = require("../controller/couponController");
const router = express.Router();
const User = require("../model/user");
const Role = require("../model/role");
const Order = require("../model/order");
const jwt = require("jsonwebtoken");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const author = require("../model/author");
const category = require("../model/category");
const book = require("../model/book");

router.get("/", async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const books = await book.find();
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const { _id } = decoded;
      const user = await User.findById(_id).select("-refreshToken -password");

      const role = await Role.findById(user.role);
      if (role.roleName == "admin") {
        return res.render("admin/index", { user });
      }
      return res.render("index", { user, books });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }
  }
  return res.render("index", { books });
});

router.get("/admin/customer", verifyToken, isAdmin, (req, res) => {
  userController.getAllUsers(req, res);
});

router.get("/admin/author", verifyToken, isAdmin, (req, res) => {
  authorController.getListAuthor(req, res);
});

router.get("/admin/coupon", verifyToken, isAdmin, (req, res) => {
  couponController.getListCoupon(req, res);
});

router.get("/admin/order", verifyToken, isAdmin, async (req, res) => {
  try {
    const response = await Order.find().populate(
      "listBooks.bookId",
      "name image price"
    );
    // res.status(200).json(response);
    return res.render("admin/order", { response });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/admin/category", verifyToken, isAdmin, (req, res) => {
  categoryController.getListCategory(req, res);
});

router.get("/admin/book", verifyToken, isAdmin, (req, res) => {
  bookController.getAllBooksByAdmin(req, res);
});

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  return res.render("admin/index");
});

router.get("/service", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  res.render("Pages/service", { user });
});

router.get("/getUser", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  res.render("Pages/infoAccount", { user });
});

router.get("/user/author", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("cart lastname");
  const response = await author.find();
  res.render("Pages/author", { user, response });
});

router.get("/book/book-filter", verifyToken, async (req, res) => {
  const books = await book.find();
  const categories = await category.find();
  res.render("Pages/book-filter", { books, categories });
});

router.get("/user/category", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("cart lastname");
  const response = await category.find();
  res.render("Pages/category", { user, response });
});

router.get("/contact", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  res.render("Pages/contact", { user });
});
router.get("/book-filter", async (req, res) => {
  res.render("Pages/book-filter");
});

router.get("/book-detail", async (req, res) => {
  res.render("Pages/book-detail");
});

router.get("/orderSuccess", verifyToken, async (req, res) => {
  res.render("Pages/orderSuccess");
});

router.get("/getAllOrderByUser", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("cart lastname");
  const orders = await Order.find({ userId: _id }).populate(
    "listBooks.bookId",
    "name image"
  );
  // res.status(200).json(orders);
  return res.render("Pages/orderByUser", { orders, user });
  // res.render("Pages/orderByUser");
});




router.get("/cart-item", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id)
    .select("cart lastname")
    .populate({ path: "cart.book", select: "_id name image price" });
  if (user) {
    res.render("Pages/cart-item", { user });
  }
});

router.get("/checkout", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id)
    .select("cart lastname")
    .populate({ path: "cart.book", select: "_id name image price" });
  if (user) {
    res.render("Pages/checkout", { user });
  }
});

router.get("/login", async (req, res) => {
  res.render("Pages/login");
});

router.get("/forgotPassword", async (req, res) => {
  res.render("Pages/forgotPassword");
});

router.get("/resetPassword/:token", async (req, res) => {
  res.render("Pages/resetPassword");
});

router.get("/registration", async (req, res) => {
  res.render("Pages/registration");
});

module.exports = router;
