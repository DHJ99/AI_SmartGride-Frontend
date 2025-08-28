// Database security simulation
import { generateSecureToken } from '@/utils/encryption';
import { logSecurityEvent, logSecurityWarning } from '@/utils/securityLogger';

class SecureDatabaseService {
  constructor() {
    this.connectionPool = new Map();
    this.auditLogs = [];
    this.encryptionKey = generateSecureToken();
  }

  // Encrypted storage simulation
  encryptedStorage = {
    encrypt: (data, key = this.encryptionKey) => {
      try {
        const jsonString = JSON.stringify(data);
        const timestamp = Date.now();
        const nonce = generateSecureToken().substring(0, 16);
        
        // Simulate AES-256-GCM encryption
        const encrypted = btoa(jsonString + nonce);
        const tag = generateSecureToken().substring(0, 32);
        
        return {
          data: encrypted,
          tag,
          nonce,
          timestamp,
          algorithm: 'AES-256-GCM'
        };
      } catch (error) {
        logSecurityWarning('encryption_failed', { error: error.message });
        return null;
      }
    },

    decrypt: (encryptedData, key = this.encryptionKey) => {
      try {
        if (!encryptedData || !encryptedData.data) {
          throw new Error('Invalid encrypted data format');
        }

        // Verify timestamp (prevent replay attacks)
        const age = Date.now() - encryptedData.timestamp;
        if (age > 24 * 60 * 60 * 1000) { // 24 hours
          throw new Error('Encrypted data too old');
        }

        const decrypted = atob(encryptedData.data);
        const nonceLength = 16;
        const jsonString = decrypted.substring(0, decrypted.length - nonceLength);
        
        return JSON.parse(jsonString);
      } catch (error) {
        logSecurityWarning('decryption_failed', { error: error.message });
        return null;
      }
    }
  };

  // Connection security
  secureConnection = {
    ssl: true,
    timeout: 30000,
    maxConnections: 100,
    connectionString: 'postgresql://user:pass@localhost:5432/smartgrid?sslmode=require',
    
    createConnection: () => {
      const connectionId = generateSecureToken();
      const connection = {
        id: connectionId,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        queries: 0,
        ssl: true
      };
      
      this.connectionPool.set(connectionId, connection);
      logSecurityEvent('database_connection_created', { connectionId });
      
      return connectionId;
    },

    closeConnection: (connectionId) => {
      const connection = this.connectionPool.get(connectionId);
      if (connection) {
        this.connectionPool.delete(connectionId);
        logSecurityEvent('database_connection_closed', { 
          connectionId, 
          duration: Date.now() - connection.createdAt,
          queries: connection.queries
        });
      }
    },

    validateConnection: (connectionId) => {
      const connection = this.connectionPool.get(connectionId);
      if (!connection) return false;
      
      // Check connection age (max 1 hour)
      const age = Date.now() - connection.createdAt;
      if (age > 60 * 60 * 1000) {
        this.closeConnection(connectionId);
        return false;
      }
      
      return true;
    }
  };

  // Data validation schemas
  schemas = {
    user: {
      id: { type: 'string', required: true, pattern: /^user_[a-zA-Z0-9]+$/ },
      email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
      role: { type: 'string', required: true, enum: ['admin', 'operator', 'analyst', 'viewer'] },
      permissions: { type: 'array', required: false }
    },
    gridNode: {
      id: { type: 'string', required: true, pattern: /^[a-zA-Z0-9_-]+$/ },
      name: { type: 'string', required: true, minLength: 3, maxLength: 50 },
      type: { type: 'string', required: true, enum: ['generator', 'load', 'substation', 'transformer'] },
      capacity: { type: 'number', required: true, min: 0, max: 10000 },
      voltage: { type: 'number', required: true, min: 0, max: 1000000 },
      status: { type: 'string', required: true, enum: ['online', 'offline', 'maintenance', 'warning'] }
    },
    apiKey: {
      id: { type: 'string', required: true },
      name: { type: 'string', required: true, minLength: 3, maxLength: 50 },
      key: { type: 'string', required: true, pattern: /^sk-[a-zA-Z0-9]{32,}$/ },
      permissions: { type: 'array', required: true },
      status: { type: 'string', required: true, enum: ['active', 'revoked', 'expired'] }
    }
  };

  // Data validation
  validateSchema(data, schemaName) {
    const schema = this.schemas[schemaName];
    if (!schema) {
      throw new Error(`Unknown schema: ${schemaName}`);
    }

    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      // Required field check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip validation if field is not required and not provided
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }
      
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        if (!(rules.type === 'array' && Array.isArray(value))) {
          errors.push(`${field} must be of type ${rules.type}`);
          continue;
        }
      }
      
      // String validations
      if (rules.type === 'string' && typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be no more than ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
      
      // Number validations
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${field} must be no more than ${rules.max}`);
        }
      }
      
      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Parameterized query simulation (prevents SQL injection)
  prepareQuery(query, params = []) {
    // Simulate parameterized query preparation
    let preparedQuery = query;
    let paramIndex = 0;
    
    // Replace ? placeholders with sanitized parameters
    preparedQuery = preparedQuery.replace(/\?/g, () => {
      if (paramIndex < params.length) {
        const param = params[paramIndex++];
        
        // Sanitize parameter based on type
        if (typeof param === 'string') {
          return `'${param.replace(/'/g, "''")}'`; // Escape single quotes
        } else if (typeof param === 'number') {
          return param.toString();
        } else if (param === null || param === undefined) {
          return 'NULL';
        } else {
          return `'${JSON.stringify(param).replace(/'/g, "''")}'`;
        }
      }
      return '?';
    });
    
    return {
      query: preparedQuery,
      paramCount: paramIndex,
      safe: paramIndex === params.length
    };
  }

  // Audit logging
  auditLog(action, user, data, result = 'success') {
    const logEntry = {
      id: generateSecureToken(),
      timestamp: new Date().toISOString(),
      action,
      userId: user?.id || 'system',
      userRole: user?.role || 'system',
      userEmail: user?.email || 'system',
      data: this.sanitizeAuditData(data),
      result,
      ip: this.getCurrentIP(),
      userAgent: navigator?.userAgent || 'unknown'
    };
    
    this.auditLogs.push(logEntry);
    
    // Keep only last 10000 audit logs
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }
    
    logSecurityEvent('database_audit', logEntry);
    
    return logEntry;
  }

  sanitizeAuditData(data) {
    if (!data) return data;
    
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'apiKey'];
    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  getCurrentIP() {
    // In a real application, this would be provided by the server
    return '192.168.1.100';
  }

  // Data access control
  checkDataAccess(user, resource, action) {
    const permissions = {
      'admin': ['read', 'write', 'delete'],
      'operator': ['read', 'write'],
      'analyst': ['read'],
      'viewer': ['read']
    };
    
    const userPermissions = permissions[user?.role] || [];
    const hasAccess = userPermissions.includes(action);
    
    if (!hasAccess) {
      logSecurityWarning('data_access_denied', {
        userId: user?.id,
        userRole: user?.role,
        resource,
        action,
        requiredPermission: action
      });
    }
    
    return hasAccess;
  }

  // Secure CRUD operations
  async secureCreate(tableName, data, user) {
    if (!this.checkDataAccess(user, tableName, 'write')) {
      throw new Error('Insufficient permissions for create operation');
    }
    
    // Validate data
    const validation = this.validateSchema(data, tableName);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Encrypt sensitive data
    const encryptedData = this.encryptedStorage.encrypt(data);
    
    // Audit log
    this.auditLog('CREATE', user, { table: tableName, recordId: data.id });
    
    // Simulate database insert
    return {
      success: true,
      id: data.id,
      encrypted: !!encryptedData
    };
  }

  async secureRead(tableName, conditions, user) {
    if (!this.checkDataAccess(user, tableName, 'read')) {
      throw new Error('Insufficient permissions for read operation');
    }
    
    // Audit log
    this.auditLog('READ', user, { table: tableName, conditions });
    
    // Simulate database select
    return {
      success: true,
      data: [],
      count: 0
    };
  }

  async secureUpdate(tableName, id, data, user) {
    if (!this.checkDataAccess(user, tableName, 'write')) {
      throw new Error('Insufficient permissions for update operation');
    }
    
    // Validate data
    const validation = this.validateSchema(data, tableName);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Audit log
    this.auditLog('UPDATE', user, { table: tableName, recordId: id, changes: Object.keys(data) });
    
    // Simulate database update
    return {
      success: true,
      id,
      updated: true
    };
  }

  async secureDelete(tableName, id, user) {
    if (!this.checkDataAccess(user, tableName, 'delete')) {
      throw new Error('Insufficient permissions for delete operation');
    }
    
    // Audit log
    this.auditLog('DELETE', user, { table: tableName, recordId: id });
    
    // Simulate database delete
    return {
      success: true,
      id,
      deleted: true
    };
  }

  // Get audit logs
  getAuditLogs(filters = {}) {
    let logs = [...this.auditLogs];
    
    if (filters.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }
    
    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action);
    }
    
    if (filters.since) {
      const since = new Date(filters.since);
      logs = logs.filter(log => new Date(log.timestamp) >= since);
    }
    
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Database health check
  healthCheck() {
    return {
      status: 'healthy',
      connections: this.connectionPool.size,
      maxConnections: this.secureConnection.maxConnections,
      auditLogs: this.auditLogs.length,
      uptime: Date.now() - (this.startTime || Date.now()),
      ssl: this.secureConnection.ssl,
      encryption: 'AES-256-GCM'
    };
  }
}

export const secureDatabaseService = new SecureDatabaseService();