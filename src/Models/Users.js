/* Plugins. */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Helpers. */
const { jwt: jwtDetails } = require('../../config');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        required: false,
        default: null
    },

    dateOfBirth: {
        type: Date,
        required: false,
        default: null
    },

    aboutMe: {
        type: String,
        default: null
    },

    enableNotification: {
        type: Boolean,
        default: true
    },

    pushSubscriptions: {
        type: [Object],
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: null
    },

    deletedAt: {
        type: Date,
        default: null
    },

    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    }

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) { next({ error }) };
});

/* Functionality to check the password matches with the entered password. */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

/* Functionaity to JWT token. so users can access API only if the token is valid. */
userSchema.methods.generateAuthToken = function () {
    let token = jwt.sign({
        _id: this._id,
        role: this.role,
        name: this.name,
        email: this.email,
    }, jwtDetails?.accessToken, { expiresIn: '3d' });
    return token;
};

const User = mongoose.model('Users', userSchema, 'Users');
module.exports = User;