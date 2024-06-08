const router = require("express").Router();
const categoryController = require("../controller/categoryController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/select", verifyToken, categoryController.getListCategoryJson);
router.get("/", verifyToken, categoryController.getListCategory);
router.post("/", verifyToken, isAdmin, categoryController.addCategory);
router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
