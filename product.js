const express = require("express");
const {
  getallProducts,
  createProduct,
  updateProducts,
  deleteProducts,
  getSingleProduct,
  getProductReviews,
  deleteReview,
  createProductReview,
  getAdminProducts,
} = require("../controllers/product");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router.route("/products").get(getallProducts);
router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/product/:id").get(getSingleProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProducts)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProducts);
router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);
module.exports = router;
