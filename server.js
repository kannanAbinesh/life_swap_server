/* Plugins. */
const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");

/* Helpers. */
const { port, db } = require('./config.js');
const { verifyToken } = require('./src/Middlewares/verifyToken.js');
const authRoutes = require('./src/Routes/authRoutes');
const habitsRoutes = require('./src/Routes/habitsRoutess.js');

/* Variables. */
const app = express();
const server = http.createServer(app);

/* Middlewares. */
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* Routes middlewares. */
app.use('/api/v1/auth/', verifyToken, authRoutes);
app.use('/api/v1/habits/', verifyToken, habitsRoutes);

/* MongoDB connections. */
mongoose.connect(db?.url)
    .then(() => console.log('MongoDB connected'))
    .catch(error => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

/* Start server functionality. */
server.listen(port, '0.0.0.0', () => {
    console.log(`The port is running in ${port} port.`);
});