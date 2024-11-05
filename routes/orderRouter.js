const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrentUserOrder,
} = require("../controllers/orderController");

router.get(
  "/",
  [authenticateUser, authorizePermissions("admin")],
  getAllOrders
);
router.post("/", authenticateUser, createOrder);
router.get("/showAllMyOrders", authenticateUser, getCurrentUserOrder);
router.get("/:orderId", authenticateUser, getSingleOrder);
router.patch("/:orderId", authenticateUser, updateOrder);

module.exports = router;
