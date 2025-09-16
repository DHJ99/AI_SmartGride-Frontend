import { User, JWTToken } from '../types/auth';

// Mock users for demonstration
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@smartgrid.com',
    role: 'admin',
    firstName: 'System',
    lastName: 'Administrator',
  },
  {
    id: '2',
    username: 'operator',
    password: 'operator123',
    email: 'operator@smartgrid.com',
    role: 'operator',
    firstName: 'Grid',
    lastName: 'Operator',
  },
  {
    id: '3',
    username: 'viewer',
    password: 'viewer123',
    email: 'viewer@smartgrid.com',
    role: 'viewer',
    firstName: 'System',
    lastName: 'Viewer',
  },
];

// Mock JWT token generation
export const generateMockToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000),
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
};

// Mock JWT token verification
export const verifyMockToken = (token: string): JWTToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    return payload as JWTToken;
  } catch {
    return null;
  }
};

// Mock authentication
export const authenticateUser = async (
  username: string,
  password: string
): Promise<{ user: User; token: string } | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = mockUsers.find(
    u => u.username === username && u.password === password
  );
  
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  const token = generateMockToken(userWithoutPassword);
  
  return { user: userWithoutPassword, token };
};

// Get user from token
export const getUserFromToken = (token: string): User | null => {
  const payload = verifyMockToken(token);
  if (!payload) return null;
  
  const user = mockUsers.find(u => u.id === payload.sub);
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Role permissions
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = { admin: 3, operator: 2, viewer: 1 };
  return (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) >= 
         (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0);
};