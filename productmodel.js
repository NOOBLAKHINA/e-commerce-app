const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "please provide name"],
		trim: true,
	},
	description: {
		type: String,
		required: [true, "please enter description"],
	},
	price: {
		type: Number,
		required: [true, "please provide price"],
		maxLength: [6, "price cannot exceed 6 figure"],
	},
	ratings: {
		type: Number,
		default: 0,
	},
	images: [
		{
			public_id: {
				type: String,
				required: true,
			},

			url: {
				type: String,
				required: true,
			},
		},
	],
	category: {
		type: String,
		required: [true, "please enter category"],
	},
	stock: {
		type: Number,
		required: [true, "please enter stock"],
		maxLength: [4, "limit exceeded"],
		default: 1,
	},
	numOfReviews: {
		type: Number,
		default:0
	},
	reviews: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				ref: "User",
				required:true
				
			},
			name: {
				type: String,
				required:true,
			},
			rating: {
				type: Number,
				required: true
			},
			comment: {
				type: String,
				required:true,
			}
		}
	],
	user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
	createdAt: {
		type: Date,
		default:Date.now
	}
})
module.exports=mongoose.model('Product',productSchema)