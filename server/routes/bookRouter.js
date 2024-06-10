const express = require('express');
const router = express.Router();
const controller = require('../controller/bookController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')
// Middleware để xử lý JSON bodies
router.use(express.json());

// Routes cho việc xử lý sách

router.get("/book-filter", controller.getAllBooks);
router.get("/book-detail/:id", controller.getBookById);
router.get("/category", controller.getBooksByIdCategory);
router.get("/search", controller.searchBookByName);

router.post("/", verifyToken, isAdmin, controller.addBook);
router.post("/update/:id", verifyToken, isAdmin, controller.updateBook);
router.delete("/:id", verifyToken, isAdmin, controller.deleteBook);

module.exports = router;
