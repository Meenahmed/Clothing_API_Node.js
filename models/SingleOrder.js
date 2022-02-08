const mongoose = require('mongoose');

const SingleOrderItemSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	image: {
		type: [String],
		required: true,
		default:
			'https://res.cloudinary.com/meenah-signature/image/upload/v1644263990/products-image/tmp-1-1644263986916_f91edb.jpg',
	},
	price: {
		type: Number,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	product: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		require: true,
	},
});

module.exports = SingleOrderItemSchema;
