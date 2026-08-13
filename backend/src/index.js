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

app.set('trust proxy', 1);

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://code-master1-0.vercel.app';

const allowedOrigins = [
  'https://code-master1-0.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
  const cleaned = process.env.FRONTEND_URL.replace(/\/+$/, '');
  if (!allowedOrigins.includes(cleaned)) {
    allowedOrigins.push(cleaned);
  }
}

app.use(cors({
  origin: function (origin, callback) {
    console.log(`the origin is : ${origin}`)
    if (!origin) return callback(null, true);
    const cleanedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(cleanedOrigin) || cleanedOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
