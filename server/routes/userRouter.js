const router = require("express").Router();
const controller = require("../controller/userController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

// CREATE
router.post("/register", controller.register);
router.post("/login", controller.login);



// READ
router.get("/logout", controller.logOut);

router.get("/refreshAccessToken", controller.refreshAccessToken);

//  get user detail
router.get("/getUser", verifyToken, controller.getUser);
// get All User
router.get("/getAllUser", verifyToken, isAdmin, controller.getAllUsers);

router.get("/forgotPassword", controller.forgotPassword);
router.get("/resetPassword", controller.resetPassword);


// UPDATE
router.put("/updateUser", verifyToken, controller.updateUser);

router.put("/isBlocked/:_id", verifyToken, isAdmin,controller.isBlocked);


// add cart 
router.put("/addCart",verifyToken, controller.addCart);
router.put("/removeCart/:bid",verifyToken, controller.removeCart);


// DELETE
router.delete("/deleteUser", verifyToken, isAdmin, controller.deleteUser);

module.exports = router;