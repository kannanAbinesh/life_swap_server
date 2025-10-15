/* Models */
const User = require('../Models/Users');

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) return res.status(400).json({ status: 400, message: 'Please provide name, email, and password.' });

            /* Check if email already exists */
            const existingUser = await User.findOne({ email, deletedAt: null });
            if (existingUser) return res.status(400).json({ status: 400, message: 'Email address already in use.' });

            /* Create new user */
            const newUser = new User({ name, email, password });
            await newUser.save();

            const token = await newUser.generateAuthToken(); /* Generate token for the new user */

            return res.status(200).json({
                status: 200,
                message: 'User registered successfully.',
                token,
                userDetails: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber ?? null,
                    dateOfBirth: newUser.dateOfBirth ?? null,
                    aboutMe: newUser.aboutMe ?? null,
                    enableNotification: newUser.enableNotification ?? null,
                }
            });

        } catch (error) { return res.status(400).json({ status: 400, message: 'Something went wrong, please try again later.' }) }
    },
};
