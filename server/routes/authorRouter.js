const router = require('express').Router();
const controller = require('../controller/authorController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken');

// Middleware để xác minh token và kiểm tra quyền admin
router.use(verifyToken, isAdmin);

// Routes cho việc xử lý tác giả
router.get("/", controller.getListAuthor);
router.get("/:id", controller.getDetailAuthor);
router.post("/", controller.addAuthor);
router.put("/:id", controller.updateAuthor);
router.delete("/:id", controller.deleteAuthor);

module.exports = router;
