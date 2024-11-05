const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.get("/", getAllReviews);
router.post("/", authenticateUser, createReview);
router.get("/:reviewId", getSingleReview);
router.delete("/:reviewId", authenticateUser, deleteReview);
router.patch("/:reviewId", authenticateUser, updateReview);

module.exports = router;
