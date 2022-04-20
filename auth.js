const ErrorHander = require("../utils/error-handler")
const catchAsyncError = require("./async-error")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
	const { token } = req.cookies
	console.log(token);
	if (!token) {
		return next(new ErrorHander("please login to access this resource", 401))
	}
	const decodedData = jwt.verify(token, process.env.JWT_SECRET)
	req.user = await User.findById(decodedData.id)
	next()
})
exports.authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
		}
		next()
	};
}
