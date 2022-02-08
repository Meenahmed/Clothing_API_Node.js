const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('../utils');

const createOrder = async (req, res) => {
	const { items: cartItems, tax, shippingFee } = req.body;

	if (!cartItems || cartItems.length < 1) {
		throw new CustomError.BadRequestError('No cart item provided');
	}
	if (!tax || !shippingFee) {
		throw new CustomError.BadRequestError(
			'Please provide tax and shipping fee'
		);
	}

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) {
			throw new CustomError.NotFoundError(
				`No product with id : ${item.product}`
			);
		}

		const { name, price, image, _id } = dbProduct;
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			product: _id,
		};
		// add item to order
		orderItems = [...orderItems, singleOrderItem];

		// calculate subtotal
		subtotal += item.amount * price;
	}

	// calculate total
	const total = tax + shippingFee + subtotal;

	const order = await Order.create({
		orderItems,
		total,
		subtotal,
		tax,
		shippingFee,
		user: req.user.userId,
	});

	res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (re, res) => {
	const orders = await Order.find({});

	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
	const { id: orderId } = req.params;
	const order = await Order.findOne({ _id: orderId });

	if (!order) {
		throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
	}
	checkPermissions(req.user, order.user);

	res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user.userId });

	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

module.exports = {
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	createOrder,
};
