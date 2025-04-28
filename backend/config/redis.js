import { createClient } from 'redis';

// Create Redis client with fallback to default values for local development
const redisConfig = {
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  socket: {
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

// Cache middleware function
export const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `shelfx:${req.originalUrl || req.url}`;
    
    try {
      // Check if connected and connect if not
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      
      // Try to get cached response
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        // Return cached response
        const parsedResponse = JSON.parse(cachedResponse);
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
        
        // Call original method
        return originalSend.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Redis cache error:', error);
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