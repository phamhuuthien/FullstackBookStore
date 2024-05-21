const express = require("express");
const userController = require("../controller/userController");
const authorController = require("../controller/authorController");
const categoryController = require("../controller/categoryController");
const router = express.Router();
const User = require("../model/user");
const Role = require("../model/role");
const jwt = require("jsonwebtoken");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const author = require("../model/author");
const category = require("../model/category");

router.get("/", async (req, res) => {
  // autoLogin
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const { _id } = decoded;
      const user = await User.findById(_id).select("-refreshToken -password");
      const role = await Role.findById(user.role);
      if (role.roleName == "admin") {
        return res.render("admin/index", { user });
      }
      return res.render("index", { user });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }
  } else {
    return res.render("index");
  }
});

router.get("/admin/customer", verifyToken, isAdmin, (req, res) => {
  userController.getAllUsers(req, res);
});

router.get("/admin/author", verifyToken, isAdmin, (req, res) => {
  authorController.getListAuthor(req, res);
});

router.get("/admin/category", verifyToken, isAdmin, (req, res) => {
  categoryController.getListCategory(req, res);
});

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  return res.render("admin/index");
});

router.get("/service", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  res.render("Pages/service", { user });
});

router.get("/user/author", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  const response = await author.find();
  res.render("Pages/author", { user, response });
});

router.get("/user/category", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
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

router.get("/cart-item", async (req, res) => {
  res.render("Pages/cart-item");
});

router.get("/checkout", async (req, res) => {
  res.render("Pages/checkout");
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
