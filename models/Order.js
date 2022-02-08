const mongoose = require('mongoose');
const SingleOrderItemSchema = require('./SingleOrder');

const OrderSchema = mongoose.Schema(
	{
		tax: {
			type: Number,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		subtotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		orderItems: [SingleOrderItemSchema],
		status: {
			type: String,
			enum: ['paid', 'failed', 'pending', 'canceled', 'delivered'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			require: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
