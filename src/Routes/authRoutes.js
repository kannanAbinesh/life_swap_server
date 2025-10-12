/* Plugins. */
const express = require('express');

/* Controllers. */
const { manageUsers } = require('../Controllers/manageUsers');
const { login } = require('../Controllers/login');

/* Variables. */
let authRoutes = express.Router();

/* Auth routes. */
authRoutes.post('/login', login);
authRoutes.post('/manageUsers', manageUsers);

module.exports = authRoutes;