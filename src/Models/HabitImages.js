/* Plugins. */
const mongoose = require('mongoose');

const habitImagesSchema = new mongoose.Schema({

    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },

    image: {
        type: String,
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

const HabitImages = mongoose.model('HabitImages', habitImagesSchema, 'HabitImages');
module.exports = HabitImages;