const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    priority: {type: String, enum: ['high', 'medium', 'low'], default: 'medium'},
    status: {type: String, enum: ['pending', 'completed'], default: 'pending'},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

taskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Task', taskSchema);
