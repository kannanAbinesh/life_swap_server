/* Plugins. */
const mongoose = require('mongoose');

const habitsScehma = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },

    habitName: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    timeDuration: {
        type: String,
        required: true
    },

    lifeStyle: {
        type: String,
        enum: ['productive', 'veryBusy', 'nightOwl', 'social', 'morningPerson', 'none'],
        default: 'none'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: null
    }

});

const Habits = mongoose.model('Habits', habitsScehma, 'Habits');
module.exports = Habits;