const express = require('express');
const router = express.Router();
const controller = require('../controller/ratingController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/:bookId', verifyToken, controller.addRatingUI);
// router.get('/:bookId/:ratingId', verifyToken, controller.updateRatingUI);
router.post('/:bookId/:ratingId', verifyToken, controller.deleteRatingUI);


module.exports = router;
