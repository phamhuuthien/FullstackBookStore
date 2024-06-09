const router = require('express').Router();
const controller = require('../controller/orderController')
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')

// router.get("/getAllOrderByUser", verifyToken, controller.getAllOrderByUser);
router.get("/cancleOrder/:oid", verifyToken, controller.cancelOrder);

router.get("/:oid", verifyToken, controller.getOrder);

router.post("/", verifyToken, controller.addOrder);

router.get("/", verifyToken, isAdmin, controller.getAllOrder);
router.put("/:oid", verifyToken, isAdmin, controller.updateOrder);

module.exports = router;