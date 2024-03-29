const router = require('express').Router();
const controller = require('../controller/couponController')
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')

router.get("/", verifyToken, isAdmin, controller.getListCoupon);
router.get("/:cid", verifyToken, isAdmin, controller.getDetailCoupon);
router.post("/", verifyToken, isAdmin, controller.addCoupon);
router.delete("/:cid", verifyToken, isAdmin, controller.deleteCoupon);
router.put("/:cid", verifyToken, isAdmin, controller.updateCoupon);

module.exports = router;