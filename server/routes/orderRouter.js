const router = require('express').Router();
const controller = require('../controller/orderController')
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')

router.get("/:uid", verifyToken, controller.getOrder);
router.post("/:uid", verifyToken, controller.addOrder);

router.get("/", verifyToken, isAdmin, controller.getAllOrder);
router.put("/:oid", verifyToken, isAdmin, controller.updateOrder);

module.exports = router;