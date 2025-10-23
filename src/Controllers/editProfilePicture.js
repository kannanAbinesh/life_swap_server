/* Models */
const ProfileImage = require("../Models/ProfileImage");
const User = require("../Models/Users"); // ✅ Add User model if you need to update user details
const fs = require("fs");
const path = require("path");

module.exports = {
    editProfilePicture: async (req, res) => {
        try {
            const { _id: userId } = req?.user || {};
            
            if (!userId) {
                return res.status(401).json({
                    status: 401,
                    message: "Unauthorized user."
                });
            }

            if (!req?.files || req.files.length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: "No image uploaded."
                });
            }

            // Find and delete old profile image
            const oldProfile = await ProfileImage.findOne({ userId });
            if (oldProfile) {
                const oldImagePath = path.join(__dirname, "../uploads/habits", oldProfile.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                await ProfileImage.deleteOne({ _id: oldProfile._id });
            }

            // Save new image
            const newImage = req.files[0];
            const newProfile = new ProfileImage({
                image: newImage.filename,
                userId: userId
            });
            await newProfile.save();

            // ✅ Return the image URL
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/habits/${newImage.filename}`;
            
            // ✅ Optionally update User model with profile picture
            // await User.findByIdAndUpdate(userId, { profilePicture: imageUrl });

            return res.status(200).json({
                status: 200,
                message: "Profile image updated successfully.",
                data: newProfile,
                imageUrl: imageUrl, // ✅ Added this
                userDetails: req.user // ✅ Return updated user details
            });

        } catch (error) {
            console.error("Error updating profile picture:", error);
            return res.status(500).json({
                status: 500,
                message: "Something went wrong, please try again later.",
                error: error.message
            });
        }
    }
};