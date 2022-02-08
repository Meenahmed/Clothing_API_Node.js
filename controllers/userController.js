const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
	createUserToken,
	attachCookiesToResponse,
	checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
	const users = await User.find({}).select('-password');
	res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select('-password');
	if (!user) {
		throw new CustomError.NotFoundError(`No user with id ${req.params.id}`);
	}
	checkPermissions(req.user, user._id);
	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
	const { name, email } = req.body;
	if (!name || !email) {
		throw new CustomError.BadRequestError('Name and Email are required');
	}
	const user = await User.findOne({ _id: req.user.userId });
	user.email = email;
	user.name = name;

	await user.save();

	const tokenUser = createUserToken(user);
	attachCookiesToResponse({ res, user: tokenUser });
	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;

	if (!oldPassword || !newPassword) {
		throw new CustomError.BadRequestError('Please provide both values');
	}
	const user = await User.findOne({ _id: req.user.userId });

	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError(
			'Please provide correct oldPassword'
		);
	}
	user.password = newPassword;

	await user.save();
	res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
};
