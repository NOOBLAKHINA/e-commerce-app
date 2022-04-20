const Order = require("../models/orderModel")
const ErrorHander = require("../utils/error-handler")
const Product = require("../models/productmodel")
const catchAsyncError = require("../middleware/async-error")

exports.newOrder = catchAsyncError(async (req, res, next) => {
	const {
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body
	for (let i = 0; i < orderItems.length; i++) {
		const orderItem = orderItems[i]
		const { product: _id } = orderItem

		const product = await Product.findById(_id)
		if (!product) {
			return next(new ErrorHander(`product with id ${_id} not found`, 404))
			// return next(new ErrorHander("Order not found with this id",404))
		}
		if (product.stock < orderItem.quantity) {
			return next(new ErrorHander("not enough stock", 500))
		}
	}
	const order = await Order.create({
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paidAt: Date.now(),
		user: req.user._id,
	})

	res.status(201).json({ success: true, order })
})
// get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	) //if this doesn't work remove ,between name and email and bring them under one inverted comma
	if (!order) {
		return next(new ErrorHander("Order not found with this id", 404))
	}
	res.status(200).json({
		success: true,
		order,
	})
})
// get logged in user Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
	const order = await Order.find({ user: req.user._id })

	res.status(200).json({
		success: true,
		order,
	})
})
// get all orders -- admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
	const orders = await Order.find()
	let totalAmount = 0
	orders.forEach(order => {
		totalAmount += order.totalPrice
	})
	res.status(200).json({
		success: true,
		totalAmount,
		orders,
	})
})
// Update order Status (admin)
exports.updateOrder = catchAsyncError(async (req, res, next) => {
	const order = await Order.findById(req.params.id)

	if (!order) {
		return next(new ErrorHander("Order not found with this Id", 404))
	}

	if (order.orderStatus === "Delivered") {
		return next(new ErrorHander("You have already delivered this order", 400))
	}
	if (req.body.status === "Shipped") {
		order.orderItems.forEach(async o => {
			await updateStock(o.product, o.quantity)
		})
	}

	order.orderStatus = req.body.status

	if (req.body.status === "Delivered") {
		if (order.orderStatus === "Processing") {
			return next(new ErrorHander("Order is not shipped yet", 500))
		}
		order.deliveredAt = Date.now()
	}

	await order.save({ validateBeforeSave: false })
	res.status(200).json({
		success: true,
	})
})

async function updateStock(id, quantity) {
	const product = await Product.findById(id)

	product.stock -= quantity

	await product.save({ validateBeforeSave: false })
}

// Delete Order -- admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
	const order = await Order.findById(req.params.id)
	if (!order) {
		return next(new ErrorHander("Order not found with this id", 404))
	}
	await order.remove()
	res.status(200).json({
		success: true,
	})
})
