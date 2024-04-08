const router = require('express').Router();
const controller = require('../controller/AuthorController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken');

// Middleware để xác minh token và kiểm tra quyền admin
router.use(verifyToken, isAdmin);

// Routes cho việc xử lý tác giả
router.get("/", controller.getAllAuthors);
router.get("/:id", controller.getAuthorById);
router.post("/", controller.addAuthor);
router.put("/:id", controller.updateAuthor);
router.delete("/:id", controller.deleteAuthor);

module.exports = router;
