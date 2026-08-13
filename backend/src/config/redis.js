const { createClient } = require('redis');

const host = process.env.REDIS_HOST ;
const port = parseInt(process.env.REDIS_PORT || '15377', 10);
const password = process.env.REDIS_PASSWORD ;
const username = process.env.REDIS_USER || 'default';

const redisClient = createClient({
    username,
    password,
    socket: {
        host,
        port,
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.log('⚠️ Redis reconnect attempts exceeded max retries. Disabling auto-reconnect.');
                return new Error('Redis connection failed');
            }
            return Math.min(retries * 200, 2000);
        }
    }
});

let isRedisConnected = false;

redisClient.on('connect', () => {
    isRedisConnected = true;
    console.log('✅ Connected to Redis successfully');
});

redisClient.on('error', err => {
    isRedisConnected = false;
    // Suppress continuous log spamming if disconnected
});

module.exports = redisClient;
