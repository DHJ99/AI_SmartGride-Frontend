// Production-grade API security simulation
import { generateSecureToken, hashPassword } from '@/utils/encryption';
import { rateLimiter } from '@/utils/rateLimiter';
import { logSecurityEvent, logSecurityWarning } from '@/utils/securityLogger';

class SecureApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
    this.sessionStore = new Map();
    this.tokenBlacklist = new Set();
  }

  // JWT token management with refresh
  generateJWT(user) {
    const now = Date.now();
    const expiresIn = 3600000; // 1 hour
    
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: this.getRolePermissions(user.role),
      iat: now,
      exp: now + expiresIn,
      jti: generateSecureToken() // JWT ID for tracking
    };

    const refreshToken = generateSecureToken();
    
    // Store refresh token
    this.sessionStore.set(refreshToken, {
      userId: user.id,
      createdAt: now,
      expiresAt: now + (7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
      accessToken: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload))}.${generateSecureToken().substring(0, 32)}`,
      refreshToken,
      expiresIn: expiresIn / 1000,
      tokenType: 'Bearer'
    };
  }

  getRolePermissions(role) {
    const permissions = {
      'viewer': ['read'],
      'analyst': ['read', 'analyze'],
      'operator': ['read', 'write', 'control'],
      'admin': ['read', 'write', 'delete', 'admin', 'control', 'analyze']
    };
    return permissions[role] || ['read'];
  }

  // Server-side validation simulation
  validateToken(token) {
    try {
      if (this.tokenBlacklist.has(token)) {
        logSecurityWarning('blacklisted_token_used', { token: token.substring(0, 20) + '...' });
        return { valid: false, reason: 'Token blacklisted' };
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, reason: 'Invalid token format' };
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now();
      
      if (payload.exp <= now) {
        return { valid: false, reason: 'Token expired' };
      }

      if (payload.iat > now) {
        return { valid: false, reason: 'Token used before issued' };
      }

      return { 
        valid: true, 
        payload,
        remainingTime: payload.exp - now
      };
    } catch (error) {
      logSecurityWarning('token_validation_error', { error: error.message });
      return { valid: false, reason: 'Token parsing failed' };
    }
  }

  // Refresh token functionality
  refreshAccessToken(refreshToken) {
    const session = this.sessionStore.get(refreshToken);
    
    if (!session) {
      throw new Error('Invalid refresh token');
    }

    if (session.expiresAt <= Date.now()) {
      this.sessionStore.delete(refreshToken);
      throw new Error('Refresh token expired');
    }

    // Generate new access token
    const user = this.getUserById(session.userId);
    return this.generateJWT(user);
  }

  // Revoke tokens
  revokeToken(token) {
    this.tokenBlacklist.add(token);
    logSecurityEvent('token_revoked', { token: token.substring(0, 20) + '...' });
  }

  revokeRefreshToken(refreshToken) {
    this.sessionStore.delete(refreshToken);
    logSecurityEvent('refresh_token_revoked', { refreshToken: refreshToken.substring(0, 20) + '...' });
  }

  // Rate limiting with Redis-like storage
  rateLimiter = {
    attempts: new Map(),
    
    checkLimit: (key, limit = 5, window = 900000) => {
      const now = Date.now();
      const attempts = this.rateLimiter.attempts.get(key) || [];
      const validAttempts = attempts.filter(time => now - time < window);
      
      if (validAttempts.length >= limit) {
        logSecurityWarning('rate_limit_exceeded', { 
          key, 
          attempts: validAttempts.length, 
          limit 
        });
        return false;
      }
      
      validAttempts.push(now);
      this.rateLimiter.attempts.set(key, validAttempts);
      return true;
    },

    getRemainingAttempts: (key, limit = 5, window = 900000) => {
      const now = Date.now();
      const attempts = this.rateLimiter.attempts.get(key) || [];
      const validAttempts = attempts.filter(time => now - time < window);
      return Math.max(0, limit - validAttempts.length);
    },

    getResetTime: (key, window = 900000) => {
      const attempts = this.rateLimiter.attempts.get(key) || [];
      if (attempts.length === 0) return 0;
      return Math.min(...attempts) + window;
    }
  };

  // CSRF protection
  generateCSRFToken() {
    return generateSecureToken();
  }

  validateCSRF(token, sessionToken) {
    return token === sessionToken && token.length >= 32;
  }

  // SQL injection prevention
  sanitizeQuery(query) {
    if (typeof query !== 'string') return query;
    
    // Remove dangerous SQL keywords and characters
    return query
      .replace(/['"\\]/g, '\\$&')
      .replace(/;\s*(DROP|DELETE|UPDATE|INSERT|CREATE|ALTER|EXEC|EXECUTE)\s+/gi, '')
      .replace(/UNION\s+SELECT/gi, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  // XSS protection
  sanitizeHTML(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  // Secure API request wrapper
  async secureRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestId = generateSecureToken().substring(0, 16);
    
    // Rate limiting
    const rateLimitKey = `api_${endpoint}_${options.ip || 'unknown'}`;
    if (!this.rateLimiter.checkLimit(rateLimitKey)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Add request headers (response security headers belong on the server)
    const secureHeaders = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...options.headers
    };

    // Do not attach client-managed tokens. Rely on HttpOnly cookies set by server.

    const requestOptions = {
      credentials: 'include',
      ...options,
      headers: secureHeaders
    };

    // Sanitize request body
    if (requestOptions.body && typeof requestOptions.body === 'string') {
      try {
        const bodyData = JSON.parse(requestOptions.body);
        const sanitizedData = this.sanitizeRequestData(bodyData);
        requestOptions.body = JSON.stringify(sanitizedData);
      } catch (error) {
        logSecurityWarning('request_body_sanitization_failed', { error: error.message });
      }
    }

    logSecurityEvent('api_request', {
      endpoint,
      method: options.method || 'GET',
      requestId,
      hasAuth: true
    });

    try {
      const response = await fetch(url, requestOptions);
      
      // Handle security-related status codes
      if (response.status === 401) {
        logSecurityWarning('unauthorized_request', { endpoint, requestId });
        throw new Error('Unauthorized access');
      }
      
      if (response.status === 403) {
        logSecurityWarning('forbidden_request', { endpoint, requestId });
        throw new Error('Access forbidden');
      }
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        logSecurityWarning('rate_limited_by_server', { endpoint, retryAfter });
        throw new Error(`Rate limited. Retry after ${retryAfter} seconds.`);
      }

      return response;
    } catch (error) {
      logSecurityEvent('api_request_failed', {
        endpoint,
        requestId,
        error: error.message
      });
      throw error;
    }
  }

  sanitizeRequestData(data) {
    if (typeof data === 'string') {
      return this.sanitizeHTML(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeRequestData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  // Mock user database for demo
  getUserById(userId) {
    const users = {
      'user_1': {
        id: 'user_1',
        email: 'admin@company.com',
        name: 'System Administrator',
        role: 'admin'
      },
      'user_2': {
        id: 'user_2',
        email: 'operator@company.com',
        name: 'Grid Operator',
        role: 'operator'
      },
      'user_3': {
        id: 'user_3',
        email: 'analyst@company.com',
        name: 'Data Analyst',
        role: 'analyst'
      }
    };
    return users[userId];
  }
}

export const secureApiService = new SecureApiService();