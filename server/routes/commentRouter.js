const express = require('express');
const router = express.Router();
const controller = require('../controller/commentController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken');

// Middleware để xử lý JSON bodies
router.use(express.json());

router.get("/book/:bookId", controller.getCommentsByBook);
router.get("/", controller.getAllComments);
router.get("/:id", controller.getCommentById);
router.post("/:bookId", verifyToken, controller.addComment);
router.put("/:id", verifyToken, controller.updateComment);
router.delete("/:id", verifyToken, controller.deleteComment);

module.exports = router;
