/* Models. */
const User = require('../Models/Users');

module.exports = {
    login: async (req, res) => {
        try {

            /* Verify email and password is passed. */
            const { email, password } = req?.body;
            if (!email || !password) return res.status(400).json({ status: 400, message: "Please enter required fields to login" });

            /* Get user details. */
            const userDetails = await User.findOne({ email, deletedAt: null });

            /* Check if user exists. */
            if (!userDetails) return res.status(400).json({ status: 400, message: "Please enter the valid email." });

            /* Check user status. */
            if (userDetails?.status === "inActive") return res.status(400).json({ status: 400, message: "Please contact admin to activate your account" });

            /* Check password match. */
            const isMatch = await userDetails.comparePassword(password);
            if (!isMatch) return res.status(400).json({ status: 400, message: "Please enter the valid password" });
            
            const token = await userDetails.generateAuthToken(); /* Generate auth token. */

            return res.status(200).json({
                status: 200,
                message: "Login Successful",
                token,
                userDetails: {
                    _id: userDetails?._id,
                    name: userDetails?.name,
                    email: userDetails?.email,
                    phoneNumber: userDetails?.phoneNumber,
                    dateOfBirth: userDetails?.dateOfBirth,
                    aboutMe: userDetails?.aboutMe,
                    enableNotification: userDetails?.enableNotification
                }
            });

        } catch (error) { return res.status(400).json({ message: `Something went wrong in login. Please try again later ${error}` }) };
    }
};