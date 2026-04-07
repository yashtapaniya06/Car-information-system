const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middleware/authmiddleware");

router.get("/", verifyToken, verifyAdmin, userController.getAllUsers);
router.get("/count", verifyToken, verifyAdmin, userController.getUserCount);
router.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;
