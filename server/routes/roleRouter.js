const router = require('express').Router();
const controller = require('../controller/roleController')
const {verifyToken,isAdmin} = require('../middlewares/verifyToken')

router.get("/", verifyToken, isAdmin, controller.getAllRole);
router.post("/", controller.createRole);
// router.post("/", verifyToken, isAdmin, controller.createRole);

// khi update nếu update khác cái tên admin thì toang do bên verify token sử dung tên chung là admin
router.put("/:rid", verifyToken, isAdmin, controller.updateRole);
router.delete("/:rid", verifyToken, isAdmin, controller.deleteRole);


module.exports = router