const { createClient } = require('redis');

const host = process.env.REDIS_HOST ;
const port = parseInt(process.env.REDIS_PORT || '15377', 10);
const password = process.env.REDIS_PASSWORD ;
const username = process.env.REDIS_USER || 'default';

// In-memory fallback if Redis is unavailable
const inMemoryStore = new Map();

const realClient = createClient({
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

realClient.on('connect', () => {
    isRedisConnected = true;
    console.log('✅ Connected to Redis successfully');
});

realClient.on('error', err => {
    isRedisConnected = false;
});

const redisClient = {
    connect: async () => {
        try {
            await realClient.connect();
        } catch (e) {
            console.log("⚠️ Redis client connection failed. Using in-memory fallback for local development.");
        }
    },
    set: async (key, value, options) => {
        if (isRedisConnected) {
            try {
                return await realClient.set(key, value, options);
            } catch (e) {
                console.log("Redis set error:", e.message);
            }
        }
        // Fallback
        inMemoryStore.set(key, { value, expiresAt: options?.EX ? Date.now() + options.EX * 1000 : null });
    },
    get: async (key) => {
        if (isRedisConnected) {
            try {
                return await realClient.get(key);
            } catch (e) {
                console.log("Redis get error:", e.message);
            }
        }
        // Fallback
        const data = inMemoryStore.get(key);
        if (!data) return null;
        if (data.expiresAt && data.expiresAt < Date.now()) {
            inMemoryStore.delete(key);
            return null;
        }
        return data.value;
    },
    del: async (key) => {
        if (isRedisConnected) {
            try {
                return await realClient.del(key);
            } catch (e) {
                console.log("Redis del error:", e.message);
            }
        }
        // Fallback
        inMemoryStore.delete(key);
    },
    expireAt: async (key, timestamp) => {
        if (isRedisConnected) {
            try {
                return await realClient.expireAt(key, timestamp);
            } catch (e) {
                console.log("Redis expireAt error:", e.message);
            }
        }
        // Fallback
        const data = inMemoryStore.get(key);
        if (data) {
            data.expiresAt = timestamp * 1000;
            inMemoryStore.set(key, data);
        }
    }
};

module.exports = redisClient;
