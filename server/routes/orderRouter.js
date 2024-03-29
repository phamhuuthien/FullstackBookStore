const router = require('express').Router();
const controller = require('../controller/orderController')
const { verifyToken } = require('../middlewares/verifyToken')

// router.get("/:uid", verifyToken, controller.getOrderByUserId);
router.get("/", verifyToken, controller.getOrderByUserId);
router.post("/", verifyToken, controller.addOrder);
router.put("/:oid", verifyToken, controller.updateOrder);
router.delete("/:oid", verifyToken, controller.deleteOrder);


module.exports = router;