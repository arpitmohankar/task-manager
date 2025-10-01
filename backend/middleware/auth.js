const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const verifyToken = async(req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).json({message: 'Access denied'});
    }
    
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.userId = decoded.id;
        const user = await User.findById(decoded.id).select('-password');
        req.user = user;
        next();
    }catch(error) {
        res.status(400).json({message: 'Invalid token'});
    }
};

const isAdmin = (req,res,next) => {
    if(req.user && req.user.role === 'admin') {
        next();
    }else{
        res.status(403).json({message: 'Admin access required'});
    }
};

module.exports = {verifyToken, isAdmin};
