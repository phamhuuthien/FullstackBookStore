const router = require('express').Router();
const controller = require('../controller/orderController')
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')

router.get("/cancelOrder/:oid", verifyToken, controller.cancelOrder);
router.get("/status/:oid", verifyToken, isAdmin, controller.statusOrder);

router.get("/:oid", verifyToken, controller.getOrder);

router.post("/", verifyToken, controller.addOrder);

router.put("/:oid", verifyToken, isAdmin, controller.updateOrder);

module.exports = router;