const express = require('express');
const router = express.Router();
// controller
const noteController = require('../controllers/note.controller');

// Create a new note
router.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
       const note = await noteController.create({ title, content });
       res.json({
              message: 'Note created successfully',
              note,
              status: 'success'
         
       });
    } catch (error) {
        res.json({
            item: null,
            status: err.code || err.statusCode || 500,
            message:
              err.message || "Something went wrong while reading item from DB!",
          });
    }
});

// Get all notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await noteController.findAll();
        res.json({
            message: 'Notes fetched successfully',
            notes,
            status: 'success'
        
        });
    } catch (error) {
        res.json({
            item: null,
            status: err.code || err.statusCode || 500,
            message:
              err.message || "Something went wrong while reading item from DB!",
          });
    }
});

// Get a single note
router.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await noteController.findOne(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({
            message: 'Note fetched successfully',
            note,
            status: 'success'
        
        });
    } catch (error) {
        res.json({
            item: null,
            status: err.code || err.statusCode || 500,
            message:
              err.message || "Something went wrong while reading item from DB!",
          });
    }
});

// Update a note
router.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await noteController.update(id, { title, content });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ 
            message: 'Note updated successfully', 
            note,
            status: 'success'});
    } catch (error) {
        res.json({
            item: null,
            status: err.code || err.statusCode || 500,
            message:
              err.message || "Something went wrong while reading item from DB!",
          });
    }
});

// Delete a note
router.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await noteController.delete(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully', status: 'success' });
    } catch (error) {
        res.json({
            item: null,
            status: err.code || err.statusCode || 500,
            message:
              err.message || "Something went wrong while reading item from DB!",
          });
    }
});

module.exports = router;
