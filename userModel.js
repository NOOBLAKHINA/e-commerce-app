const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "please provide name"],
		maxLength: [30, "Name cannot be more than 30 characters"],
		minLength: [4, "name should have more than 4 characters"],
	},
	email: {
		type: String,
		required: [true, "please provide email"],
		unique: true,
		validate: [validator.isEmail, "please enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "please enter your password"],
		minLength: [8, "Password should be more than 8 characters"],
		select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: true,
			default: "this is a sample id",
		},
		url: {
			type: String,
			required: true,
			default: "this is a sample url",
		},
	},
	role: {
		type: String,
		default: "user",
	},
	createdAt: {
		type: Date,
		default:Date.now()
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
})
userSchema.pre("save", async function (next) {
	if (!this.isModified()) {
		next()
	}
	// console.log(this.password)
	this.password = await bcrypt.hash(this.password, 10)
})
// JWT TOKEN
// console.log(process);
userSchema.methods.getJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})
}
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}
// Generate Password Reset Token
userSchema.methods.getResetPasswordToken =  function () {
	const resetToken = crypto.randomBytes(20).toString("hex")
	// hashing and add to userSchema
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")
	// console.log(this.resetPasswordToken)
	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
	// console.log(this.resetPasswordExpire)
	return resetToken
}
module.exports = mongoose.model("User", userSchema)
