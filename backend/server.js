const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Report = require('./models/report');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/traffic-control', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET: Fetch all reports
app.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error retrieving reports:', error);
        res.status(500).json({ error: 'Error retrieving reports' });
    }
});

// POST: Create a new report
app.post('/report', async (req, res) => {
    const { type, location, severity } = req.body;
    const newReport = new Report({ type, location, severity });

    try {
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report' });
    }
});

// DELETE: Delete a report by ID
app.delete('/report/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Error deleting report' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
