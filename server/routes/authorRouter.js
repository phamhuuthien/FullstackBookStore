const router = require('express').Router();
const controller = require('../controller/authorController');
const { verifyToken, isAdmin } = require('../middlewares/verifyToken');

router.get("/select", controller.getListAuthorJson);
router.get("/", controller.getListAuthor);
router.get("/:id", verifyToken, controller.getDetailAuthor);
router.post("/", verifyToken, isAdmin, controller.addAuthor);
router.put("/:id", verifyToken, isAdmin, controller.updateAuthor);
router.delete("/:id", verifyToken, isAdmin, controller.deleteAuthor);

module.exports = router;
