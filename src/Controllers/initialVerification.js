/* Models. */
const User = require('../Models/Users');

/* Plugins. */
const jwt = require('jsonwebtoken');

/* Helpers. */
const { jwt: jwtDetails } = require('../../config');

module.exports = {
    initialVerification: async (req, res) => {
        try {

            let token = '', requestToken = req?.header('Authorization');
            if (requestToken) token = requestToken?.replace('Bearer ', '');

            if (!token || !requestToken) return res.status(404).json({ status: 404, message: 'Invalid token' });

            try {

                let decodedToken = jwt.verify(token, jwtDetails.accessToken); /* Decode the JWT token. */

                /* Verify the user is authorized user using the jwt token. */
                const userDetails = await User.findOne({ _id: decodedToken._id, deletedAt: null, status: 'active' });
                if (!userDetails) return res.status(404).json({ status: 404 });

                let responseData = { _id: userDetails?._id, name: userDetails?.name, email: userDetails?.email };
                return res.status(200).json({ status: 200, data: { ...responseData } });

            } catch (error) { return res.status(401).json({ status: 401, message: 'Unauthorized user' }) };

        } catch (error) { return res.status(401).json({ status: 401, message: 'Something went wrong please try again later.' }) }
    }
};