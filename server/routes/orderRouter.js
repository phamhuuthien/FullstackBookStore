const router = require('express').Router();
const controller = require('../controller/orderController')
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')

router.get("/:uid", verifyToken, controller.getOrder);
router.get("/", verifyToken, isAdmin, controller.getAllOrder);
router.post("/", verifyToken, controller.addOrder);
router.put("/:oid", verifyToken, isAdmin, controller.updateOrder);
router.delete("/:oid", verifyToken, controller.deleteOrder);


module.exports = router;