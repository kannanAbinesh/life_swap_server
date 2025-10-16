/* Plugins. */
const express = require('express');

/* Controllers. */
const { editProfile } = require('../Controllers/editProfile');
const { register } = require('../Controllers/register');
const { login } = require('../Controllers/login');
const { initialVerification } = require('../Controllers/initialVerification');
const { changePassword } = require('../Controllers/changePassword');
const { googleAuthentication } = require('../Controllers/googleAuthentication');

/* Variables. */
let authRoutes = express.Router();

/* Auth routes. */
authRoutes.get('/initialVerification', initialVerification);
authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/changePassword', changePassword);
authRoutes.put('/editProfile', editProfile);
authRoutes.put('/googleAuthentication', googleAuthentication);

module.exports = authRoutes;