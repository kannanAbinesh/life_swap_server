/* Models. */
const User = require('../Models/Users');

module.exports = {
    manageUsers: async (req, res) => {
        try {

            const { _id, name, email, password, phoneNumber, dateOfBirth, aboutMe, enableNotification } = req?.body;
            console.log(req?.body, 'req?.bodyreq?.bodyreq?.body')

            /* Validate all required datas are being passed. */
            if (!name || !email) return res.status(400).json({ status: 400, message: 'Please provide required details.' });

            /* Get user details by the email. */
            const existingUser = await User.findOne({ email, deletedAt: null });

            if (_id) {

                /* Validate if other user uses the email. */
                if (existingUser && existingUser._id.toString() !== _id) return res.status(400).json({ status: 400, message: 'Email address already in use by another user.' });

                /* Update user details by userId. */
                const userDetails = await User.findById(_id);

                /* Update user details in "Users" collection. */
                userDetails.name = name;
                userDetails.email = email;
                userDetails.phoneNumber = phoneNumber || userDetails.phoneNumber;
                userDetails.dateOfBirth = dateOfBirth || userDetails.dateOfBirth;
                userDetails.aboutMe = aboutMe || userDetails.aboutMe;
                userDetails.enableNotification = enableNotification || userDetails.enableNotification;
                userDetails.updatedAt = new Date();
                userDetails.save({ validateBeforeSave: false });

                return res.status(200).json({
                    status: 200,
                    message: "User updated successfully.",
                    userDetails: {
                        _id: userDetails?._id,
                        name: userDetails?.name,
                        email: userDetails?.email,
                        phoneNumber: userDetails?.phoneNumber ?? null,
                        dateOfBirth: userDetails?.dateOfBirth ?? null,
                        aboutMe: userDetails?.aboutMe ?? null,
                        enableNotification: userDetails?.enableNotification ?? null
                    }
                });

            } else {

                /* Validate if other user uses the email. */
                if (existingUser) return res.status(400).json({ status: 400, message: 'Email address already in use.' });

                /* Create new user. */
                const newUser = new User({ name, email, password });
                await newUser.save();

                /* Token generation for new users alone. */
                const token = await newUser.generateAuthToken();

                return res.status(200).json({
                    status: 200,
                    message: "User registered successfully",
                    token,
                    userDetails: {
                        _id: newUser?._id,
                        email: newUser?.email,
                        name: newUser?.name
                    }
                });

            };

        } catch (error) {
            console.log(error, 'errorerrorerror')
            return res.status(400).json({ status: 400, message: `Something went wrong, Please try again later` })
        }
    }
};