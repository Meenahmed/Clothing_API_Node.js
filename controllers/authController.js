const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createUserToken, attachCookiesToResponse } = require('../utils');

const register = async (req, res) => {
	const { email, name, password } = req.body;

	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email already exist');
	}

	// first registered user is an admin
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? 'admin' : 'user';

	// create new User
	const user = await User.create({ name, email, password, role });
	const userToken = createUserToken(user);
	attachCookiesToResponse({ res, user: userToken });

	res.status(StatusCodes.CREATED).json({ user: userToken });
};
const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError('Email and Password is required');
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.UnauthenticatedError('No user with the email');
	}
	const isPasswordValid = await user.comparePassword(password);
	if (!isPasswordValid) {
		throw new CustomError.UnauthenticatedError('Password not valid');
	}
	const userToken = createUserToken(user);
	attachCookiesToResponse({ res, user: userToken });
	res.status(StatusCodes.OK).json({ user: userToken });
};
const logout = async (req, res) => {
	res.cookie('token', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

module.exports = {
	register,
	login,
	logout,
};
