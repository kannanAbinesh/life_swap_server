/* Plugins. */
const express = require('express');

/* Controllers. */
const { manageHabits } = require('../Controllers/manageHabits');
const { getHabits } = require('../Controllers/getHabits');

/* Helpers. */
const upload = require('../helpers/singleFileUpload');

/* Variables. */
let habitsRoutes = express.Router();

/* Habit routes. */
habitsRoutes.post('/manageHabits', upload.array('files', 12), manageHabits);
habitsRoutes.get('/getHabits', getHabits);

module.exports = habitsRoutes;