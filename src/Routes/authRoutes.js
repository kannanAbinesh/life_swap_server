/* Plugins. */
const express = require('express');

/* Controllers. */
const { manageUsers } = require('../Controllers/manageUsers');
const { login } = require('../Controllers/login');
const { initialVerification } = require('../Controllers/initialVerification');
const { changePassword } = require('../Controllers/changePassword');

/* Variables. */
let authRoutes = express.Router();

/* Auth routes. */
authRoutes.get('/initialVerification', initialVerification);
authRoutes.post('/login', login);
authRoutes.post('/manageUsers', manageUsers);
authRoutes.post('/changePassword', changePassword);

module.exports = authRoutes;