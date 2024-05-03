const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const { verifyToken } = require('../middlewares/verifyToken');

// Route xử lý các danh mục
router.get('/', verifyToken, categoryController.getListCategory);
router.post('/', verifyToken, categoryController.addCategory);
router.put('/:cid', verifyToken, categoryController.updateCategory);
router.delete('/:cid', verifyToken, categoryController.deleteCategory);

module.exports = router;
