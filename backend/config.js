module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'mysecretkey123',
    jwtExpire: '7d'
};
