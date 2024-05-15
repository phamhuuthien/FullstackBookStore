const express = require('express');
const router = express.Router();
const controller = require('../controller/ratingController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')

// Đường dẫn: /rating/:bookId/
router.post('/:bookId', verifyToken, controller.addRating);
router.put('/:bookId/:ratingId', verifyToken, controller.updateRating);
router.delete('/:bookId/:ratingId', verifyToken, controller.deleteRating);

module.exports = router;
