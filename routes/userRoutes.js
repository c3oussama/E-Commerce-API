const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router.get(
  "/",
  [authenticateUser, authorizePermissions("admin", "owner")],
  getAllUsers
);
router.get("/showMe", authenticateUser, showCurrentUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updateUserPassword", authenticateUser, updateUserPassword);
router.get(
  "/:userId",
  [authenticateUser, authorizePermissions("admin", "user")],
  getSingleUser
);

module.exports = router;
