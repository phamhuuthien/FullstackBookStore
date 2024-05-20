const express = require("express");
const userController = require("../controller/userController");
const authorController = require("../controller/authorController");
const router = express.Router();
const User = require("../model/user");
const Role = require("../model/role");
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
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

router.get("/admin/customer", (req, res) => {
  userController.getAllUsers(req, res);
});

router.get("/admin/author", (req, res) => {
  authorController.getListAuthor(req, res);
});

router.get("/admin", (req, res) => {
  return res.render("admin/index");
});

router.get("/service", function (req, res) {
  res.render("Pages/service");
});

router.get("/contact", function (req, res) {
  res.render("Pages/contact");
});
router.get("/book-filter", function (req, res) {
  res.render("Pages/book-filter");
});

router.get("/book-detail", function (req, res) {
  res.render("Pages/book-detail");
});

router.get("/cart-item", function (req, res) {
  res.render("Pages/cart-item");
});

router.get("/checkout", function (req, res) {
  res.render("Pages/checkout");
});

router.get("/login", function (req, res) {
  res.render("Pages/login");
});

router.get("/forgotPassword", function (req, res) {
  res.render("Pages/forgotPassword");
});

router.get("/resetPassword/:token", function (req, res) {
  res.render("Pages/resetPassword");
});


router.get("/registration", function (req, res) {
  res.render("Pages/registration");
});

module.exports = router;
