const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    start: { type: Date, required: true },
    deadline: { type: Date, required: true },
    description: { type: String, default: '' },
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
    course: { type: String, default: '' },
    attachments: { type: [String], default: [] },
    submission: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    completionDate: { type: Date }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);