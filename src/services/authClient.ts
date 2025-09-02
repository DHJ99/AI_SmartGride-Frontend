// Authentication client for Smart Grid Platform backend

type User = {
  id: string;
  email: string;
  name: string;
  role: 'viewer' | 'analyst' | 'operator' | 'admin';
  permissions?: string[];
  avatar?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Mock store for development fallback
const mockUsers: Record<string, User & { password: string }> = {
  'admin@company.com': {
    id: 'user_1',
    email: 'admin@company.com',
    name: 'System Administrator',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin'],
    avatar: null,
    password: 'password123'
  },
  'operator@company.com': {
    id: 'user_2',
    email: 'operator@company.com',
    name: 'Grid Operator',
    role: 'operator',
    permissions: ['read', 'write'],
    avatar: null,
    password: 'password123'
  },
  'analyst@company.com': {
    id: 'user_3',
    email: 'analyst@company.com',
    name: 'Data Analyst',
    role: 'analyst',
    permissions: ['read'],
    avatar: null,
    password: 'password123'
  }
};

let mockCurrentUser: User | null = null;

async function mockLogin(email: string, password: string): Promise<User> {
  console.log('Mock login attempt:', email);
  await new Promise((r) => setTimeout(r, 500));
  const user = mockUsers[email];
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  mockCurrentUser = { ...user };
  console.log('Mock login successful:', mockCurrentUser);
  return mockCurrentUser;
}

async function mockLogout(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  mockCurrentUser = null;
}

async function mockMe(): Promise<User | null> {
  await new Promise((r) => setTimeout(r, 200));
  return mockCurrentUser;
}

export const authClient = {
  async login(email: string, password: string): Promise<User> {
    console.log('Auth client login called, USE_MOCK:', USE_MOCK);
    
    if (USE_MOCK) {
      return mockLogin(email, password);
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || `Login failed: ${res.status}`);
      }

      // After successful login, fetch user info
      const user = await this.me();
      if (!user) {
        throw new Error('Login successful but failed to fetch user info');
      }
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      return mockLogout();
    }

    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        console.warn('Logout request failed:', res.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error for logout failures
    }
  },

  async me(): Promise<User | null> {
    if (USE_MOCK) {
      return mockMe();
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.status === 401) {
        return null; // Not authenticated
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch session: ${res.status}`);
      }

      const data = await res.json();
      return data?.user || data || null;
    } catch (error) {
      console.error('Me endpoint error:', error);
      return null;
    }
  }
};

export type { User };


