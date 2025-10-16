/* Plugins. */
const { OAuth2Client } = require('google-auth-library');

/* Model. */
const Users = require('../Models/Users');

/* Helpers. */
const { googleLogin } = require('../../config');

module.exports = {
    googleAuthentication: async (req, res) => {
        try {
            console.log('pppppppppppppp')

            const client = new OAuth2Client(googleLogin?.android);
            const { appToken } = req?.body;

            const ticket = await client.verifyIdToken({
                idToken: appToken,
                audience: googleLogin?.android,
            });
            const payload = ticket.getPayload();
            const { email, name, picture, sub: googleId } = payload;
            console.log(email, name, picture, googleId, 'email, name, picture, sub: googleIdemail, name, picture, sub: googleIdemail, name, picture, sub: googleIdemail, name, picture, sub: googleId')

            // let user = await Users.findOne({ email });
            // if (!user) {
            //     user = await Users.create({ name, email, googleId, avatar: picture });
            // }

        } catch (error) { return res.status(400).json({ status: 400, message: 'Something went wrong, please try again later.' }) }
    }
}