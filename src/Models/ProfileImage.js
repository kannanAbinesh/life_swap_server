/* Plugins. */
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },

    image: {
        type: String
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

const User = mongoose.model('ProfileImage', profileSchema, 'ProfileImage');
module.exports = User;