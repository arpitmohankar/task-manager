const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const {verifyToken, isAdmin} = require('../middleware/auth');

router.post('/register', async(req, res) => {
    try{
        const {name,email,password,role} = req.body;
        
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        
        const user = new User({
            name,
            email,
            password,
            role: role || 'user'
        });
        
        await user.save();
        
        const token = jwt.sign({id: user._id}, config.jwtSecret, {expiresIn: config.jwtExpire});
        
        res.status(201).json({
            message: 'User registered!',
            token,
            user: {id: user._id, name: user.name, email: user.email, role: user.role}
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/login', async(req,res) => {
    try{
        const {email,password} = req.body;
        
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'Invalid credentials'});
        
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});
        
        const token = jwt.sign({id: user._id}, config.jwtSecret, {expiresIn: config.jwtExpire});
        
        res.json({
            message: 'Login successful',
            token,
            user: {id: user._id, name: user.name, email: user.email, role: user.role}
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/users', verifyToken, isAdmin, async(req,res) => {
    try{
        const users = await User.find().select('-password');
        res.json(users);
    }catch(error){
        res.status(500).json({message: 'Error fetching users'});
    }
});

router.delete('/users/:userId', verifyToken, isAdmin, async(req,res) => {
    try{
        const {userId} = req.params;
        if(userId === req.userId) {
            return res.status(400).json({message: 'Cannot delete yourself'});
        }
        await User.findByIdAndDelete(userId);
        res.json({message: 'User deleted'});
    }catch(error){
        res.status(500).json({message: 'Error deleting user'});
    }
});

module.exports = router;
