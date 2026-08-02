const express = require('express');
const app = express();
require('dotenv').config();

const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require('./routes/aiChatting');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);

const InitalizeConnection = async () => {
    try {
        await main();
        
        try {
            await redisClient.connect();
        } catch (redisErr) {
            console.log("⚠️ Redis Note: Redis client not connected (running in fallback mode)");
        }

        app.listen(PORT, () => {
            console.log("🚀 Server listening at port number: " + PORT);
        });
    } catch (err) {
        console.log("Initialization Error: " + err);
        process.exit(1);
    }
};

InitalizeConnection();
