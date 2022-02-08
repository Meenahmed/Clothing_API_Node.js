const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Please provide product name'],
			maxlength: [100, 'Name can not be more than 100 characters'],
		},
		price: {
			type: Number,
			required: [true, 'Please provide product price'],
			default: 0,
		},
		description: {
			type: String,
			trim: true,
			required: [true, 'Please describe the product'],
			maxlength: [1000, 'Name can not be more than 1000 characters'],
		},
		image: {
			type: [String],
			default:
				'https://res.cloudinary.com/meenah-signature/image/upload/v1644263990/products-image/tmp-1-1644263986916_f91edb.jpg',
		},
		category: {
			type: String,
			required: [true, 'Please provide product category'],
			enum: ['kids', 'women', 'men'],
		},
		company: {
			type: String,
			required: [true, 'Please provide product company'],
			enum: {
				values: ['meenah', 'meerah', 'liyyah'],
				message: '{VALUES} is not supported',
			},
		},
		colors: {
			type: [String],
			default: ['#222'],
			required: true,
		},
		inventory: {
			type: Number,
			required: true,
			default: 10,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
