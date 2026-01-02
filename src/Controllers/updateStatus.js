/* Models. */
const User = require('../Models/Users');
const ProfileImage = require('../Models/ProfileImage');

module.exports = {
    updateStatus: async (req, res) => {
        try {

            const { type } = req?.body;

            if (type === 'notificationStatus') {

                /* Update the notification status. */
                const userDetails = await User.findOne({ _id: req?.user?._id });
                userDetails.enableNotification = req?.body?.status;
                await userDetails.save();

                /* Retrive profile picture. */
                const profilePicture = await ProfileImage.findOne({ userId: req?.user?._id });

                return res.status(200).json({
                    status: 200,
                    message: `Notification has been ${req?.body?.status ? 'activated' : 'deactivated'}`,
                    data: {
                        _id: req?.user?._id,
                        name: userDetails.name,
                        email: userDetails.email,
                        phoneNumber: userDetails?.phoneNumber ?? null,
                        dateOfBirth: userDetails?.dateOfBirth ?? null,
                        aboutMe: userDetails?.aboutMe ?? null,
                        enableNotification: userDetails?.enableNotification ?? null,
                        profilePicture: profilePicture?._id ? profilePicture?.image : ''
                    }
                });
            };

        } catch (error) { return res.status(400).json({ status: 400, message: `Something went wrong in updating the status: ${error}` }) }
    }
}