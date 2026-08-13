const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const adminMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        if (!token) throw new Error("Token is not present");
        const jwtSecret = process.env.JWT_SECRET || "48dda0e1ee047700c9e81fa470e825f8cd790f94d9bbc8b1d6ca16426847d44e";
        const payload = jwt.verify(token, jwtSecret);
        const { _id } = payload;
        if (!_id) throw new Error("Invalid token");
        const result = await User.findOne({ _id });
         if(payload.role!='admin') throw new Error("Invalid Credentials");
        let isBlocked = false;
        try {
          if (redisClient && redisClient.isOpen) {
            isBlocked = await redisClient.exists(`token:${token}`);
          }
        } catch (redisErr) {
          // Ignore redis error when checking token blocklist
        }
        if (isBlocked) throw new Error("Invalid Token");
        req.result = result;
        next();
    } catch (err) {
        res.status(401).send("Error: here " + err.message);
    }
};

module.exports = adminMiddleware;