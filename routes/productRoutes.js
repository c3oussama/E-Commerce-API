const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");
const { getSingleProductReviews } = require("../controllers/reviewController");

router.get("/", getAllProduct);
router.post(
  "/",
  [authenticateUser, authorizePermissions("admin")],
  createProduct
);
router.post(
  "/uploadImage",
  [authenticateUser, authorizePermissions("admin")],
  uploadImage
);
router.delete(
  "/:productId",
  [authenticateUser, authorizePermissions("admin")],
  deleteProduct
);
router.patch(
  "/:productId",
  [authenticateUser, authorizePermissions("admin")],
  updateProduct
);
router.get("/:productId", getSingleProduct);

module.exports = router;

router.get("/:productId/reviews", getSingleProductReviews);
