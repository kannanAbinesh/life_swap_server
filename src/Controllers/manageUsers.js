/* Models. */
const User = require('../Models/Users');

module.exports = {
    manageUsers: async (req, res) => {
        try {

            const { id, name, email, password } = req?.body;

            /* Validate all required datas are being passed. */
            if (!name || !email) return res.status(400).json({ status: 400, message: 'Please provide required details.' });

            /* Get user details by the email. */
            const existingUser = await User.findOne({ email, deletedAt: null });

            if (id) {

                /* Validate if other user uses the email. */
                if (existingUser && existingUser._id.toString() !== id) return res.status(400).json({ status: 400, message: 'Email address already in use by another user.' });

                /* Update user details by userId. */
                const userDetails = await User.findById(id);

                /* Update user details in "Users" collection. */
                userDetails.name = name;
                userDetails.email = email;
                userDetails.updatedAt = new Date();
                userDetails.save({ validateBeforeSave: false });

                return res.status(200).json({ status: 200, message: "User updated successfully." });

            } else {

                /* Validate if other user uses the email. */
                if (existingUser) return res.status(400).json({ status: 400, message: 'Email address already in use.' });
                
                /* Create new user. */
                const newUser = new User({ name, email, password });
                await newUser.save();

                return res.status(200).json({ status: 200, message: "User registered successfully" });

            };

        } catch (error) { return res.status(400).json({ status: 400, message: `Something went wrong, Please try again later` }) }
    }
};