const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single complaint
router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create complaint
router.post('/', async (req, res) => {
    try {
        const complaint = new Complaint(req.body);
        const newComplaint = await complaint.save();
        res.status(201).json(newComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update complaint
router.put('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        
        Object.assign(complaint, req.body);
        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete complaint
router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        
        await complaint.deleteOne();
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 