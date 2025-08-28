// Client-side rate limiting
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  isAllowed(key, limit = 10, window = 60000) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filter out old requests outside the time window
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  getRemainingRequests(key, limit = 10, window = 60000) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < window);
    
    return Math.max(0, limit - validRequests.length);
  }

  getResetTime(key, window = 60000) {
    const requests = this.requests.get(key) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    return oldestRequest + window;
  }

  clear(key) {
    this.requests.delete(key);
  }

  clearAll() {
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();

export const withRateLimit = async (key, fn, limit = 10, window = 60000) => {
  if (!rateLimiter.isAllowed(key, limit, window)) {
    const resetTime = rateLimiter.getResetTime(key, window);
    const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
    
    throw new Error(`Rate limit exceeded. Try again in ${waitTime} seconds.`);
  }
  
  return await fn();
};

export const createApiRateLimiter = (baseLimit = 100, baseWindow = 60000) => {
  return {
    async request(endpoint, options = {}) {
      const key = `api_${endpoint}`;
      const limit = options.rateLimit?.limit || baseLimit;
      const window = options.rateLimit?.window || baseWindow;
      
      return withRateLimit(key, async () => {
        const response = await fetch(endpoint, options);
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          throw new Error(`Rate limited by server. Retry after ${retryAfter} seconds.`);
        }
        
        return response;
      }, limit, window);
    }
  };
};