const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// GET
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (err){
        res.status(500).jason({error: err.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findOne({id: req.params.id});
        if(!assignment) return res.status(404).json({message: 'Assignment not found'});
        res.json(assignment);
    } catch (err){
        res.status(500).json({error: err.message});
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const assignments = await Assignment.find({}, {id: 1, _id:0}).sort({id:1})

        let newId = 1;
        for(const assignment of assignments){
            if (assignment.id === newId){
                newId++;
            }else if(assignment.id > newId){
                break;
            }
        }
        const newAssignment = new Assignment({
            id: newId,
            ...req.body
        });
        const savedAssignment = await newAssignment.save();
        res.status(201).json(savedAssignment);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// PUT/UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedAssignment = await Assignment.findOneAndUpdate(
            {id: req.params.id},
            req.body,
            {new: true}
        );
        if (!updatedAssignment) return res.status(404).json({message: 'Assignment not found'});
        res.json(updatedAssignment);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deletedAssignment = await Assignment.findOneAndDelete({ id: req.params.id });
        if(!deletedAssignment) return res.status(404).json({message: 'Assignment not found'});
        res.json({message: 'Assignment deleted'});
    } catch (err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;