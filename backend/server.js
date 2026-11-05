const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const teamMemberRoutes = require('./routes/teamMemberRoutes');
const taskRoutes = require('./routes/taskRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/dashboard', dashboardRoutes);



// Home route
app.get('/', (req, res) => {
    res.send('Welcome to TeamTrack Backend!');
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`TeamTrack server running on port ${PORT}`);
});
