const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const eventRoutes = require('./src/routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/events', eventRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

