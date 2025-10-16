/* Plugins. */
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3005,
    environment: process.env.ENVIRONMENT || 'DEVELOPMENT',
    serverBaseURL: `${process.env.SERVER_BASE_URL || 'http://localhost:'}${process.env.PORT || 3005}/`,
    browserBaseURL: process.env.BROWSER_BASE_URL, 
    db: {
        url: process.env.ENVIRONMENT === "DEVELOPMENT" ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL
    },
    jwt: { accessToken: process.env.ACCESS_TOKEN },
    googleLogin: {
        android: process.env.ANDROID_GOOGLE_LOGIN_CLINET_ID
    }
};