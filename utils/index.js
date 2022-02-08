const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createUserToken = require('./createUserToken');
const checkPermissions = require('./checkPermission');

module.exports = {
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
	createUserToken,
	checkPermissions,
};
