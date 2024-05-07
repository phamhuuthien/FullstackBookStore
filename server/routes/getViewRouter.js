const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("index");
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

router.get("/registration", function (req, res) {
  res.render("Pages/registration");
});

module.exports = router;
