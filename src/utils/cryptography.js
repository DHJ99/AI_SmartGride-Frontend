// Production-grade cryptography utilities
class CryptographyService {
  constructor() {
    this.algorithms = {
      AES_GCM: 'AES-GCM',
      RSA_OAEP: 'RSA-OAEP',
      ECDSA: 'ECDSA',
      PBKDF2: 'PBKDF2'
    };
  }

  // AES-256-GCM encryption
  aes256 = {
    encrypt: async (plaintext, password) => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);
        
        // Derive key from password using PBKDF2
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          encoder.encode(password),
          'PBKDF2',
          false,
          ['deriveBits', 'deriveKey']
        );
        
        const key = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
        
        // Generate random IV
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Encrypt data
        const encrypted = await crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv: iv
          },
          key,
          data
        );
        
        return {
          encrypted: Array.from(new Uint8Array(encrypted)),
          iv: Array.from(iv),
          salt: Array.from(salt),
          algorithm: 'AES-256-GCM',
          iterations: 100000
        };
      } catch (error) {
        console.error('AES encryption failed:', error);
        throw new Error('Encryption failed');
      }
    },
    
    decrypt: async (encryptedData, password) => {
      try {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        
        // Derive key from password using same parameters
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          encoder.encode(password),
          'PBKDF2',
          false,
          ['deriveBits', 'deriveKey']
        );
        
        const key = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: new Uint8Array(encryptedData.salt),
            iterations: encryptedData.iterations,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
        
        // Decrypt data
        const decrypted = await crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv: new Uint8Array(encryptedData.iv)
          },
          key,
          new Uint8Array(encryptedData.encrypted)
        );
        
        return decoder.decode(decrypted);
      } catch (error) {
        console.error('AES decryption failed:', error);
        throw new Error('Decryption failed');
      }
    }
  };

  // RSA key pair generation and operations
  rsa = {
    generateKeyPair: async (keySize = 2048) => {
      try {
        const keyPair = await crypto.subtle.generateKey(
          {
            name: 'RSA-OAEP',
            modulusLength: keySize,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256'
          },
          true,
          ['encrypt', 'decrypt']
        );
        
        const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        
        return {
          publicKey: Array.from(new Uint8Array(publicKey)),
          privateKey: Array.from(new Uint8Array(privateKey)),
          keySize,
          algorithm: 'RSA-OAEP'
        };
      } catch (error) {
        console.error('RSA key generation failed:', error);
        throw new Error('Key generation failed');
      }
    },

    encrypt: async (data, publicKeyData) => {
      try {
        const encoder = new TextEncoder();
        const publicKey = await crypto.subtle.importKey(
          'spki',
          new Uint8Array(publicKeyData),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
          },
          false,
          ['encrypt']
        );
        
        const encrypted = await crypto.subtle.encrypt(
          'RSA-OAEP',
          publicKey,
          encoder.encode(data)
        );
        
        return Array.from(new Uint8Array(encrypted));
      } catch (error) {
        console.error('RSA encryption failed:', error);
        throw new Error('RSA encryption failed');
      }
    },

    decrypt: async (encryptedData, privateKeyData) => {
      try {
        const decoder = new TextDecoder();
        const privateKey = await crypto.subtle.importKey(
          'pkcs8',
          new Uint8Array(privateKeyData),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
          },
          false,
          ['decrypt']
        );
        
        const decrypted = await crypto.subtle.decrypt(
          'RSA-OAEP',
          privateKey,
          new Uint8Array(encryptedData)
        );
        
        return decoder.decode(decrypted);
      } catch (error) {
        console.error('RSA decryption failed:', error);
        throw new Error('RSA decryption failed');
      }
    }
  };

  // Secure hash functions
  hash = {
    sha256: async (data) => {
      try {
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (error) {
        console.error('SHA-256 hashing failed:', error);
        throw new Error('Hashing failed');
      }
    },
    
    sha512: async (data) => {
      try {
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-512', encoder.encode(data));
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (error) {
        console.error('SHA-512 hashing failed:', error);
        throw new Error('Hashing failed');
      }
    },
    
    // Simulate bcrypt-style password hashing
    bcrypt: async (password, rounds = 12) => {
      try {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const encoder = new TextEncoder();
        
        // Use PBKDF2 as bcrypt simulation
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          encoder.encode(password),
          'PBKDF2',
          false,
          ['deriveBits']
        );
        
        const derivedBits = await crypto.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: Math.pow(2, rounds),
            hash: 'SHA-256'
          },
          keyMaterial,
          256
        );
        
        const hash = Array.from(new Uint8Array(derivedBits))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        const saltHex = Array.from(salt)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        return `$2b$${rounds.toString().padStart(2, '0')}$${saltHex}${hash}`;
      } catch (error) {
        console.error('Bcrypt hashing failed:', error);
        throw new Error('Password hashing failed');
      }
    },

    verifyBcrypt: async (password, hash) => {
      try {
        const parts = hash.split('$');
        if (parts.length !== 4 || parts[1] !== '2b') {
          return false;
        }
        
        const rounds = parseInt(parts[2]);
        const saltAndHash = parts[3];
        const salt = saltAndHash.substring(0, 32);
        const originalHash = saltAndHash.substring(32);
        
        // Recreate hash with same salt and rounds
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          encoder.encode(password),
          'PBKDF2',
          false,
          ['deriveBits']
        );
        
        const saltBytes = new Uint8Array(
          salt.match(/.{2}/g).map(byte => parseInt(byte, 16))
        );
        
        const derivedBits = await crypto.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt: saltBytes,
            iterations: Math.pow(2, rounds),
            hash: 'SHA-256'
          },
          keyMaterial,
          256
        );
        
        const newHash = Array.from(new Uint8Array(derivedBits))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        return newHash === originalHash;
      } catch (error) {
        console.error('Bcrypt verification failed:', error);
        return false;
      }
    }
  };

  // Digital signatures using ECDSA
  signature = {
    generateKeyPair: async () => {
      try {
        const keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: 'P-256'
          },
          true,
          ['sign', 'verify']
        );
        
        const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        
        return {
          publicKey: Array.from(new Uint8Array(publicKey)),
          privateKey: Array.from(new Uint8Array(privateKey)),
          algorithm: 'ECDSA',
          curve: 'P-256'
        };
      } catch (error) {
        console.error('ECDSA key generation failed:', error);
        throw new Error('Signature key generation failed');
      }
    },

    sign: async (data, privateKeyData) => {
      try {
        const encoder = new TextEncoder();
        const privateKey = await crypto.subtle.importKey(
          'pkcs8',
          new Uint8Array(privateKeyData),
          {
            name: 'ECDSA',
            namedCurve: 'P-256'
          },
          false,
          ['sign']
        );
        
        const signature = await crypto.subtle.sign(
          {
            name: 'ECDSA',
            hash: 'SHA-256'
          },
          privateKey,
          encoder.encode(data)
        );
        
        return Array.from(new Uint8Array(signature));
      } catch (error) {
        console.error('ECDSA signing failed:', error);
        throw new Error('Signing failed');
      }
    },

    verify: async (data, signature, publicKeyData) => {
      try {
        const encoder = new TextEncoder();
        const publicKey = await crypto.subtle.importKey(
          'spki',
          new Uint8Array(publicKeyData),
          {
            name: 'ECDSA',
            namedCurve: 'P-256'
          },
          false,
          ['verify']
        );
        
        return await crypto.subtle.verify(
          {
            name: 'ECDSA',
            hash: 'SHA-256'
          },
          publicKey,
          new Uint8Array(signature),
          encoder.encode(data)
        );
      } catch (error) {
        console.error('ECDSA verification failed:', error);
        return false;
      }
    }
  };

  // Secure random number generation
  random = {
    bytes: (length) => {
      return Array.from(crypto.getRandomValues(new Uint8Array(length)));
    },

    string: (length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
      const bytes = crypto.getRandomValues(new Uint8Array(length));
      return Array.from(bytes, byte => charset[byte % charset.length]).join('');
    },

    uuid: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    token: (length = 32) => {
      // Ensure correct binding; refer to sibling method directly
      return cryptoService.random.string(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    }
  };

  // Key derivation functions
  kdf = {
    pbkdf2: async (password, salt, iterations = 100000, keyLength = 32) => {
      try {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          encoder.encode(password),
          'PBKDF2',
          false,
          ['deriveBits']
        );
        
        const derivedBits = await crypto.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt: typeof salt === 'string' ? encoder.encode(salt) : salt,
            iterations,
            hash: 'SHA-256'
          },
          keyMaterial,
          keyLength * 8
        );
        
        return Array.from(new Uint8Array(derivedBits));
      } catch (error) {
        console.error('PBKDF2 derivation failed:', error);
        throw new Error('Key derivation failed');
      }
    }
  };

  // Utility functions
  utils = {
    arrayToHex: (array) => {
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    hexToArray: (hex) => {
      return new Uint8Array(hex.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    },

    arrayToBase64: (array) => {
      return btoa(String.fromCharCode(...array));
    },

    base64ToArray: (base64) => {
      return new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
    },

    constantTimeCompare: (a, b) => {
      if (a.length !== b.length) return false;
      
      let result = 0;
      for (let i = 0; i < a.length; i++) {
        result |= a[i] ^ b[i];
      }
      return result === 0;
    }
  };
}

export const cryptoService = new CryptographyService();