/* Plugins. */
const { default: mongoose } = require("mongoose");

/* Models. */
const User = require("../Models/Users");

module.exports = {
    changePassword: async (req, res) => {
        try {

            const { currentPassword, newPassword } = req.body;

            /* Validate all required datas are being passed. */
            if (!currentPassword || !newPassword || !req.user._id) return res.status(400).json({ status: 400, message: "Invalid Request." });

            /* Get specific users data using the userId. */
            const userDetails = await User.findById(new mongoose.Types.ObjectId(req.user._id));
            if (!userDetails) return res.status(404).json({ status: 400, message: 'User not found' });

            /* Verify entered entered current password matches the password in DB.  */
            let isMatch = await userDetails.comparePassword(currentPassword);
            if (!isMatch) return res.status(400).json({ status: 400, message: 'Current password is incorrect' });

            /* Update the password in DB. */
            userDetails.password = newPassword;
            await userDetails.save();

            return res.status(200).json({ status: 200, message: 'Password updated successfully' });

        } catch (error) { return res.status(400).json({ status: 400, message: `Something went wrong in changing password: ${error}` }) };
    }
};