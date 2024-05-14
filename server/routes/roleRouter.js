const router = require('express').Router();
const controller = require('../controller/roleController')
const {verifyToken,isAdmin} = require('../middlewares/verifyToken')

router.get("/", verifyToken, isAdmin, controller.getAllRole);
router.post("/", verifyToken, isAdmin, controller.createRole);
router.put("/:rid", verifyToken, isAdmin, controller.updateRole);
router.delete("/:rid", verifyToken, isAdmin, controller.deleteRole);
    

module.exports = router