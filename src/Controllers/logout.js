/* Models. */
const Login = require('../Models/Login');

module.exports = {
    logout: async (req, res) => {
        try {

            const { _id } = req?.user;
            const token = req.header('Authorization').replace('Bearer ', '');

            if (!_id || !token) return res.status(400).json({ status: 400, message: "Invalid request, userId and token required" });

            const loginSession = await Login.findOne({ userId: _id, token });
            if (!loginSession) return res.status(404).json({ status: 404, message: "Login session not found" });

            loginSession.updatedAt = new Date();
            await loginSession.save();

            return res.status(200).json({ status: 200, message: "Logout successful" });

        } catch (error) { return res.status(400).json({ status: 400, message: `Something went wrong in logout: ${error}` }) }
    }
};