const router = require('express').Router();
const controller = require('../controller/couponController')
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')

router.post("/checkCoupon", verifyToken, controller.getCouponByCode);
router.get("/", verifyToken, controller.getListCoupon);
router.get("/:cid", verifyToken, controller.getDetailCoupon);

router.post("/", verifyToken, isAdmin, controller.addCoupon);
router.delete("/:cid", verifyToken, isAdmin, controller.deleteCoupon);
router.put("/:cid", verifyToken, isAdmin, controller.updateCoupon);

module.exports = router;