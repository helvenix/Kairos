const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const assignmentRoutes = require('./routes/assignments');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://localhost:27017/kairos_db';
mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error: ', err));

app.use('/api/assignments', assignmentRoutes);

app.get('/', (req, res) => {
    res.send('Hello from Kairos Express API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});