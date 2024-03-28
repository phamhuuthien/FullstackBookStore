const express = require('express');
const router = express.Router();
const controller = require('../controller/bookController');

// Middleware để xử lý JSON bodies
router.use(express.json());

// Routes cho việc xử lý sách
router.get("/", controller.getAllBooks);
router.get("/:id", controller.getBookById);
router.post("/", controller.addBook);
router.put("/:id", controller.updateBook);
router.delete("/:id", controller.deleteBook);
router.get("/category/:categoryId", controller.getBooksByIdCategory);
router.put("/:id/inc-like", controller.increaseLikeBook);
router.put("/:id/dec-like", controller.decreaseLikeBook);

module.exports = router;
