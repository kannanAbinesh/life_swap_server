/* Plugins. */
const fs = require("fs");
const path = require("path");

/* Models */
const ProfileImage = require("../Models/ProfileImage");
const User = require("../Models/Users");

module.exports = {
    editProfilePicture: async (req, res) => {
        try {

            const { _id: userId } = req?.user || {};

            if (!userId) return res.status(400).json({ status: 400, message: "Unauthorized user." });

            const userDetails = await User.findOne({ _id: userId });
            if (!userDetails) return res.state(400).json({ status: 400, message: 'User not found' });

            if (!req?.files || req.files.length === 0) return res.status(400).json({ status: 400, message: "No image uploaded." });

            const oldProfile = await ProfileImage.findOne({ userId });
            if (oldProfile) {
                const oldImagePath = path.join(__dirname, `../uploads/${req?.body?.type}`, oldProfile?.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
                await ProfileImage.deleteOne({ _id: oldProfile._id });
            };

            const newImage = req.files[0];
            const newProfile = new ProfileImage({ image: newImage.filename, userId: userId });
            await newProfile.save();

            return res.status(200).json({
                status: 200,
                message: "Profile image updated successfully.",
                data: {
                    _id: userId,
                    name: userDetails.name,
                    email: userDetails.email,
                    phoneNumber: userDetails?.phoneNumber ?? null,
                    dateOfBirth: userDetails?.dateOfBirth ?? null,
                    aboutMe: userDetails?.aboutMe ?? null,
                    enableNotification: userDetails?.enableNotification ?? null,
                    profilePicture: newImage.filename ?? ""
                }
            });

        } catch (error) { return res.status(400).json({ status: 400, message: `Something went wrong, please try again later: ${error}` }) }
    }
};