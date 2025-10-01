const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const {verifyToken} = require('../middleware/auth');

router.get('/', verifyToken, async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1) * limit;
        
        let filter = {};
        if(req.user.role !== 'admin') {
            filter.assignedTo = req.userId;
        }
        
        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);
        
        const totalTasks = await Task.countDocuments(filter);
        
        res.json({
            tasks,
            currentPage: page,
            totalPages: Math.ceil(totalTasks/limit),
            totalTasks
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error fetching tasks'});
    }
});

router.get('/:id', verifyToken, async(req,res) => {
    try{
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name');
        
        if(!task) return res.status(404).json({message: 'Task not found'});
        
        if(req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.userId) {
            return res.status(403).json({message: 'Access denied'});
        }
        
        res.json(task);
    }catch(error){
        res.status(500).json({message: 'Error fetching task'});
    }
});

router.post('/', verifyToken, async(req,res) => {
    try{
        const {title,description,dueDate,priority,assignedTo} = req.body;
        
        const task = new Task({
            title,
            description,
            dueDate,
            priority: priority || 'medium',
            assignedTo: assignedTo || req.userId,
            createdBy: req.userId
        });
        
        await task.save();
        await task.populate('assignedTo', 'name email');
        await task.populate('createdBy', 'name');
        
        res.status(201).json({message: 'Task created!', task});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error creating task'});
    }
});

router.put('/:id', verifyToken, async(req,res) => {
    try{
        const {title,description,dueDate,priority,status,assignedTo} = req.body;
        
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: 'Task not found'});
        
        if(req.user.role !== 'admin' && task.assignedTo.toString() !== req.userId) {
            return res.status(403).json({message: 'Cannot edit this task'});
        }
        
        if(title) task.title = title;
        if(description) task.description = description;
        if(dueDate) task.dueDate = dueDate;
        if(priority) task.priority = priority;
        if(status) task.status = status;
        if(assignedTo && req.user.role === 'admin') task.assignedTo = assignedTo;
        
        await task.save();
        await task.populate('assignedTo', 'name email');
        await task.populate('createdBy', 'name');
        
        res.json({message: 'Task updated!', task});
    }catch(error){
        res.status(500).json({message: 'Error updating task'});
    }
});

router.delete('/:id', verifyToken, async(req,res) => {
    try{
        const task = await Task.findById(req.params.id);
        
        if(!task) return res.status(404).json({message: 'Task not found'});
        
        if(req.user.role !== 'admin' && task.assignedTo.toString() !== req.userId) {
            return res.status(403).json({message: 'Cannot delete this task'});
        }
        
        await Task.findByIdAndDelete(req.params.id);
        res.json({message: 'Task deleted!'});
    }catch(error){
        res.status(500).json({message: 'Error deleting task'});
    }
});

router.patch('/:id/priority', verifyToken, async(req,res) => {
    try{
        const {priority} = req.body;
        
        if(!['high','medium','low'].includes(priority)) {
            return res.status(400).json({message: 'Invalid priority'});
        }
        
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: 'Task not found'});
        
        if(req.user.role !== 'admin' && task.assignedTo.toString() !== req.userId) {
            return res.status(403).json({message: 'Access denied'});
        }
        
        task.priority = priority;
        await task.save();
        
        res.json({message: `Priority updated to ${priority}`, task});
    }catch(error){
        res.status(500).json({message: 'Error updating priority'});
    }
});

router.patch('/:id/status', verifyToken, async(req,res) => {
    try{
        const task = await Task.findById(req.params.id);
        
        if(!task) return res.status(404).json({message: 'Task not found'});
        
        if(req.user.role !== 'admin' && task.assignedTo.toString() !== req.userId) {
            return res.status(403).json({message: 'Access denied'});
        }
        
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        await task.save();
        
        res.json({message: `Task ${task.status}!`, task});
    }catch(error){
        res.status(500).json({message: 'Error updating status'});
    }
});

module.exports = router;
