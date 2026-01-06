/* Plugins. */
const mongoose = require('mongoose');

const adoptedHabitsScehma = new mongoose.Schema({

    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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

const AdoptedHabits = mongoose.model('AdoptedHabits', adoptedHabitsScehma, 'AdoptedHabits');
module.exports = AdoptedHabits;