const express = require("express")
const router = express.Router()
const {
	register,
	login,
	logOut,
	forgotPassword,
	resetPassword,
	getUserDetails,
	updatePassword,
	updateProfile,
	getAllUser,
	getSingleUser,
	deleteUser,
	updateUserRole,
	createProductReview,
} = require("../controllers/user")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logOut)
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)
router.route("/me/update").put(isAuthenticatedUser, updateProfile)
router
	.route("/admin/users")
	.get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser)
router
	.route("/admin/user/:id")
	.get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
	.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)
	.put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
module.exports = router
