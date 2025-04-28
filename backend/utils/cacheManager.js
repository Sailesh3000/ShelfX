import redisClient, { clearCache } from '../config/redis.js';

/**
 * Cache Manager Utility
 * Provides functions to manage Redis cache for the ShelfX application
 */

// Clear cache for specific routes when data changes
const cacheManager = {
  // Clear all book-related caches
  clearBookCache: async () => {
    await clearCache('books');
    await clearCache('api/books');
  },

  // Clear user-specific caches
  clearUserCache: async (userId) => {
    await clearCache(`users/${userId}`);
    await clearCache(`api/users/${userId}`);
  },

  // Clear seller-specific caches
  clearSellerCache: async (sellerId) => {
    await clearCache(`sellers/${sellerId}`);
    await clearCache(`api/sellers/${sellerId}`);
  },

  // Clear buyer-specific caches
  clearBuyerCache: async (buyerId) => {
    await clearCache(`buyers/${buyerId}`);
    await clearCache(`api/buyers/${buyerId}`);
  },

  // Clear admin-related caches
  clearAdminCache: async () => {
    await clearCache('admin');
    await clearCache('api/admin');
  },

  // Clear all caches
  clearAllCache: async () => {
    await clearCache();
  },

  // Get cache status
  getCacheStatus: async () => {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const info = await redisClient.info();
      return {
        connected: redisClient.isOpen,
        info
      };
    } catch (error) {
      console.error('Error getting cache status:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }
};

export default cacheManager;