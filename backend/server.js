const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/authRoutes');
const tasks = require('./routes/taskRoutes');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Attach io to req for controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Mount routers
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected...');
        server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
    })
    .catch(err => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    });
