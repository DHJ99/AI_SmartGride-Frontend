class RateLimiter {
  private requests: Map<string, number[]>

  constructor() {
    this.requests = new Map()
  }

  isAllowed(key: string, limit = 10, windowMs = 60000): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const validRequests = requests.filter(time => now - time < windowMs)
    if (validRequests.length >= limit) return false
    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true
  }

  getRemainingRequests(key: string, limit = 10, windowMs = 60000): number {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const validRequests = requests.filter(time => now - time < windowMs)
    return Math.max(0, limit - validRequests.length)
  }

  getResetTime(key: string, windowMs = 60000): number {
    const requests = this.requests.get(key) || []
    if (requests.length === 0) return 0
    const oldestRequest = Math.min(...requests)
    return oldestRequest + windowMs
  }

  clear(key: string): void {
    this.requests.delete(key)
  }

  clearAll(): void {
    this.requests.clear()
  }
}

export const rateLimiter = new RateLimiter()

export const withRateLimit = async <T>(key: string, fn: () => Promise<T>, limit = 10, windowMs = 60000): Promise<T> => {
  if (!rateLimiter.isAllowed(key, limit, windowMs)) {
    const resetTime = rateLimiter.getResetTime(key, windowMs)
    const waitTime = Math.ceil((resetTime - Date.now()) / 1000)
    throw new Error(`Rate limit exceeded. Try again in ${waitTime} seconds.`)
  }
  return await fn()
}

export const createApiRateLimiter = (baseLimit = 100, baseWindow = 60000) => {
  return {
    async request(endpoint: string, options: RequestInit & { rateLimit?: { limit?: number; window?: number } } = {}) {
      const key = `api_${endpoint}`
      const limit = options.rateLimit?.limit || baseLimit
      const window = options.rateLimit?.window || baseWindow
      return withRateLimit(key, async () => {
        const response = await fetch(endpoint, options)
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          throw new Error(`Rate limited by server. Retry after ${retryAfter} seconds.`)
        }
        return response
      }, limit, window)
    }
  }
}


