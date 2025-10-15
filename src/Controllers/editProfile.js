/* Models */
const User = require('../Models/Users');

module.exports = {
    editProfile: async (req, res) => {
        try {

            const { name, email, phoneNumber, dateOfBirth, aboutMe } = req.body;
            const { _id } = req.user;

            if (!_id) return res.status(401).json({ status: 400, message: 'Unauthorized: User ID missing.' });

            /* Find user exists. */
            const user = await User.findOne({ _id, deletedAt: null });
            if (!user) return res.status(404).json({ status: 404, message: 'User not found.' });

            /* Check if the mail already exists. */
            if (email) {
                const existingUser = await User.findOne({ email, deletedAt: null });
                if (existingUser && existingUser._id.toString() !== _id.toString()) return res.status(400).json({ status: 400, message: 'Email address already in use by another user.' });
            };

            /* Update user details. */
            user.name = name ?? user.name;
            user.phoneNumber = phoneNumber ?? user.phoneNumber;
            user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;
            user.aboutMe = aboutMe ?? user.aboutMe;
            user.updatedAt = new Date();
            await user.save({ validateBeforeSave: false });

            return res.status(200).json({
                status: 200,
                message: 'Profile updated successfully.',
                userDetails: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber ?? null,
                    dateOfBirth: user.dateOfBirth ?? null,
                    aboutMe: user.aboutMe ?? null,
                    enableNotification: user.enableNotification ?? null,
                },
            });

        } catch (error) { return res.status(400).json({ status: 400, message: 'Something went wrong, please try again later.' }) }
    }
};
