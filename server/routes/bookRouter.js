const express = require('express');
const router = express.Router();
const controller = require('../controller/bookController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')
// Middleware để xử lý JSON bodies
router.use(express.json());

// Routes cho việc xử lý sách
router.get("/",verifyToken, controller.getAllBooks);
router.get("/:id",verifyToken, controller.getBookById);
router.post("/",verifyToken,isAdmin, controller.addBook);
router.put("/:id",verifyToken,isAdmin, controller.updateBook);
router.delete("/:id",verifyToken,isAdmin, controller.deleteBook);
router.get("/category/:categoryId",verifyToken, controller.getBooksByIdCategory);
router.put("/:id/inc-like",verifyToken, controller.increaseLikeBook);
router.put("/:id/dec-like",verifyToken, controller.decreaseLikeBook);

module.exports = router;
