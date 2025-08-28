// Minimal cookie-based auth client with optional dev mock

type User = {
  id: string;
  email: string;
  name: string;
  role: 'viewer' | 'analyst' | 'operator' | 'admin';
  permissions?: string[];
  avatar?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_AUTH || '').toLowerCase() === 'true';

// Mock store for dev only (no tokens; simulates cookie session)
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
  await new Promise((r) => setTimeout(r, 500));
  const user = mockUsers[email];
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  mockCurrentUser = { ...user };
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
    if (USE_MOCK) return mockLogin(email, password);
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message || 'Login failed');
    }
    const me = await this.me();
    if (!me) throw new Error('Login failed');
    return me;
  },

  async logout(): Promise<void> {
    if (USE_MOCK) return mockLogout();
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Logout failed');
  },

  async me(): Promise<User | null> {
    if (USE_MOCK) return mockMe();
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });
    if (res.status === 401) return null;
    if (!res.ok) throw new Error('Failed to fetch session');
    const data = (await res.json()) as User;
    return data ?? null;
  }
};

export type { User };


