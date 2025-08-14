require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

const PORT = process.env.PORT || 4000;

// DB connection
require('./DBConn/conn');

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const GymRoutes = require('./Routes/gym');
const MembershipRoutes = require('./Routes/membership');
const MemberRoutes = require('./Routes/member');

app.use('/auth', GymRoutes);
app.use('/plans', MembershipRoutes);
app.use('/members', MemberRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});




