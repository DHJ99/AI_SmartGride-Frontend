export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove script tags and other dangerous HTML
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

export const validateGridNode = (node) => {
  const errors = {};
  
  if (!node.name || node.name.length < 3 || node.name.length > 50) {
    errors.name = 'Name must be between 3 and 50 characters';
  }
  
  if (!node.capacity || node.capacity <= 0 || node.capacity > 10000) {
    errors.capacity = 'Capacity must be between 1 and 10000 MW';
  }
  
  if (!['generator', 'load', 'substation', 'transformer'].includes(node.type)) {
    errors.type = 'Invalid node type';
  }
  
  if (!node.voltage || node.voltage <= 0 || node.voltage > 1000000) {
    errors.voltage = 'Voltage must be between 1 and 1,000,000 V';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateApiKey = (key) => {
  const keyRegex = /^sk-[a-zA-Z0-9]{32,}$/;
  return keyRegex.test(key);
};

export const validateIPAddress = (ip) => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

export const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

export const validateFileUpload = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  const errors = {};
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.type = `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  if (file.size > maxSize) {
    errors.size = `File size too large. Maximum size: ${maxSize / 1024 / 1024}MB`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};