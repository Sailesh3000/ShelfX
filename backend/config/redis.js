import { createClient } from 'redis';

// Configure Redis client for Upstash Redis with TLS support
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://default:AS7EAAIjcDFhZDUzMjJiNjFkMTQ0YWZkOTg1MzYxZjc5ZTliNjFjM3AxMA@valued-serval-11972.upstash.io:6379',
  socket: {
    tls: true,
    reconnectStrategy: (retries) => {
      // Exponential backoff: 2^retries * 100ms
      return Math.min(retries * 100, 3000);
    }
  }
};

// Create Redis client
const redisClient = createClient(redisConfig);

// Handle Redis connection events
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

// Cache middleware function with performance measurement
export const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `shelfx:${req.originalUrl || req.url}`;
    const startTime = performance.now();
    let cacheHit = false;
    
    try {
      // Check if connected and connect if not
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      
      // Try to get cached response
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        // Return cached response
        cacheHit = true;
        const parsedResponse = JSON.parse(cachedResponse);
        const endTime = performance.now();
        console.log(`[REDIS PERFORMANCE] Cache HIT: ${req.originalUrl || req.url} - Response time: ${(endTime - startTime).toFixed(2)}ms`);
        return res.status(200).json(parsedResponse);
      }
      
      // Store original send method
      const originalSend = res.json;
      
      // Override res.json method to cache response before sending
      res.json = function(body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(key, duration, JSON.stringify(body));
        }
        
        const endTime = performance.now();
        console.log(`[REDIS PERFORMANCE] Cache MISS: ${req.originalUrl || req.url} - Response time: ${(endTime - startTime).toFixed(2)}ms`);
        
        // Call original method
        return originalSend.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Redis cache error:', error);
      const endTime = performance.now();
      console.log(`[REDIS PERFORMANCE] Cache ERROR: ${req.originalUrl || req.url} - Response time: ${(endTime - startTime).toFixed(2)}ms`);
      next(); // Continue without caching
    }
  };
};

// Helper function to clear cache
export const clearCache = async (pattern) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    
    if (pattern) {
      // Clear specific pattern
      const keys = await redisClient.keys(`shelfx:${pattern}*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } else {
      // Clear all cache with shelfx prefix
      const keys = await redisClient.keys('shelfx:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export default redisClient;