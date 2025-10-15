/* Plugins. */
const jwt = require('jsonwebtoken');

/* Model. */
const User = require('../Models/Users');

/* Helpers. */
const { jwt: jwtDetails, environment } = require('../../config');

/* Variables. */
const devExcludedRoutes = [''];
const excludedRoutes = ["/login", "/forgetPassword", "/resetPassword", "/register", "/getSiteSettings", "/initialVerification" ];

module.exports = {
    verifyToken: async (req, res, next) => {
        try {

            /* Skip verify token middleware for excluded routes. */
            if (excludedRoutes.includes(req?.path)) return next();

            /* Validatet token is send in the header. */
            const token = req.header('Authorization').replace('Bearer ', '');
            if (!token) return res.status(401).json({ status: 401, message: 'Access denied. No token provided.' });

            /* Action to validate the token and retrive the data from the token to set it in the request of incoming API. */
            try {
                
                let decodedToken = jwt.verify(token, jwtDetails?.accessToken);
                const userDetails = await User.findOne({ _id: decodedToken?._id, deletedAt: null });
                if(!userDetails) return res.status(401).json({ status: 401, message: 'Access denied. No token provided.' });
                
                req.user = userDetails;
                next();
            } catch (error) { return res.status(401).json({ status: 401, message: 'Invalid token.' }) };

        } catch (error) { return res.status(401).json({ status: 401, message: `Something went wrong in verifing token: ${error}` }) };
    }
};