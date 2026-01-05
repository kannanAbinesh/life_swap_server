/* Plugins. */
const express = require('express');

/* Controllers. */
const { manageHabits } = require('../Controllers/manageHabits');
const { getHabits } = require('../Controllers/getHabits');
const { adoptHabits } = require('../Controllers/adoptHabits');

/* Helpers. */
const upload = require('../helpers/singleFileUpload');

/* Variables. */
let habitsRoutes = express.Router();

/* Habit routes. */
habitsRoutes.post('/manageHabits', upload.array('files', 12), manageHabits);
habitsRoutes.get('/getHabits', getHabits);
habitsRoutes.post('/adoptHabits', adoptHabits);

module.exports = habitsRoutes;