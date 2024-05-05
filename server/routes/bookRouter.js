const express = require('express');
const router = express.Router();
const controller = require('../controller/bookController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')
// Middleware để xử lý JSON bodies
router.use(express.json());

// Routes cho việc xử lý sách
router.get("/", controller.getAllBooks);
router.get("/:id", controller.getBookById);
router.get("/category/:categoryId", controller.getBooksByIdCategory);
router.put("/:id/inc-like", verifyToken, controller.increaseLikeBook);
router.put("/:id/dec-like", verifyToken, controller.decreaseLikeBook);

router.post("/", verifyToken, isAdmin, controller.addBook);
router.put("/:id", verifyToken, isAdmin, controller.updateBook);
router.delete("/:id", verifyToken, isAdmin, controller.deleteBook);

module.exports = router;
