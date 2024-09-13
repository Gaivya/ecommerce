const dotenv = require('dotenv').config();
const staticToken = 'a1b2c3d4';


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token !== staticToken) return res.sendStatus(401);


    next();
};




module.exports = authenticateToken;
