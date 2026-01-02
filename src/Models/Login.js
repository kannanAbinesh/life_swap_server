/* Plugins. */
const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({

    token: {
        type: String,
        required: [true, 'Token is required']
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'UserId is required']
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

const Login = mongoose.model('Login', loginSchema, 'Login');
module.exports = Login;