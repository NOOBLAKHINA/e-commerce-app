const express = require("express")
const { processPayment, sendStripeApiKey } = require("../controllers/payment")
const router = express.Router()
const { isAuthenticatedUser } = require("../middleware/auth")
// router.route
router.route("/payment/process").post(isAuthenticatedUser, processPayment)
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey)
module.exports = router
