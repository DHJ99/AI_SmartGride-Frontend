import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Shield, Mail, Phone, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { format } from 'date-fns';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'operator' | 'viewer' | 'analyst' | 'maintenance';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin: number;
  createdAt: number;
  department: string;
  permissions: string[];
  mfaEnabled: boolean;
  loginAttempts: number;
}

interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  startTime: number;
  lastActivity: number;
  status: 'active' | 'expired';
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@smartgrid.com',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      status: 'active',
      lastLogin: Date.now() - 3600000,
      createdAt: Date.now() - 31536000000,
      department: 'IT Operations',
      permissions: ['all'],
      mfaEnabled: true,
      loginAttempts: 0,
    },
    {
      id: '2',
      username: 'operator_jones',
      email: 'jones@smartgrid.com',
      firstName: 'Sarah',
      lastName: 'Jones',
      role: 'operator',
      status: 'active',
      lastLogin: Date.now() - 1800000,
      createdAt: Date.now() - 15768000000,
      department: 'Grid Operations',
      permissions: ['dashboard', 'monitoring', 'topology', 'alerts'],
      mfaEnabled: true,
      loginAttempts: 0,
    },
    {
      id: '3',
      username: 'analyst_brown',
      email: 'brown@smartgrid.com',
      firstName: 'Michael',
      lastName: 'Brown',
      role: 'analyst',
      status: 'active',
      lastLogin: Date.now() - 7200000,
      createdAt: Date.now() - 7884000000,
      department: 'Analytics',
      permissions: ['dashboard', 'analytics', 'reports'],
      mfaEnabled: false,
      loginAttempts: 0,
    },
    {
      id: '4',
      username: 'maintenance_smith',
      email: 'smith@smartgrid.com',
      firstName: 'David',
      lastName: 'Smith',
      role: 'maintenance',
      status: 'active',
      lastLogin: Date.now() - 14400000,
      createdAt: Date.now() - 5259600000,
      department: 'Maintenance',
      permissions: ['dashboard', 'monitoring', 'maintenance'],
      mfaEnabled: true,
      loginAttempts: 0,
    },
    {
      id: '5',
      username: 'viewer_wilson',
      email: 'wilson@smartgrid.com',
      firstName: 'Emily',
      lastName: 'Wilson',
      role: 'viewer',
      status: 'inactive',
      lastLogin: Date.now() - 2592000000,
      createdAt: Date.now() - 2629800000,
      department: 'Management',
      permissions: ['dashboard'],
      mfaEnabled: false,
      loginAttempts: 3,
    },
  ]);

  const [sessions, setSessions] = useState<UserSession[]>([
    {
      id: 'session-1',
      userId: '1',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0.0',
      location: 'New York, NY',
      startTime: Date.now() - 3600000,
      lastActivity: Date.now() - 300000,
      status: 'active',
    },
    {
      id: 'session-2',
      userId: '2',
      ipAddress: '192.168.1.105',
      userAgent: 'Firefox 121.0.0.0',
      location: 'Chicago, IL',
      startTime: Date.now() - 1800000,
      lastActivity: Date.now() - 120000,
      status: 'active',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'operator' | 'viewer' | 'analyst' | 'maintenance'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'viewer' as const,
    department: '',
    permissions: [] as string[],
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    const user: User = {
      id: `user-${Date.now()}`,
      ...newUser,
      status: 'pending',
      lastLogin: 0,
      createdAt: Date.now(),
      mfaEnabled: false,
      loginAttempts: 0,
    };

    setUsers(prev => [user, ...prev]);
    setNewUser({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'viewer',
      department: '',
      permissions: [],
    });
    setShowCreateModal(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId 
        ? { 
            ...user, 
            status: user.status === 'active' ? 'inactive' : 'active' 
          }
        : user
    ));
  };

  const handleResetPassword = (userId: string) => {
    // In a real app, this would trigger password reset
    alert(`Password reset email sent to user ${userId}`);
  };

  const terminateSession = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId ? { ...session, status: 'expired' } : session
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'operator':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'analyst':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      case 'maintenance':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'viewer':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTime = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const userCounts = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    operators: users.filter(u => u.role === 'operator').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    mfaEnabled: users.filter(u => u.mfaEnabled).length,
  };

  const activeSessions = sessions.filter(s => s.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Users size={32} className="text-white" />
                <h1 className="text-3xl font-bold">User Management</h1>
              </div>
              <p className="text-blue-100 text-lg">
                Comprehensive user administration, role management, and access control.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">{userCounts.active}</div>
              <div className="text-blue-200">Active Users</div>
              <div className="text-sm text-blue-300 mt-1">
                {activeSessions.length} active sessions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {userCounts.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {userCounts.active}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </Card>
        <Card className="text-center border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {userCounts.admins}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Admins</div>
        </Card>
        <Card className="text-center border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {userCounts.operators}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Operators</div>
        </Card>
        <Card className="text-center border-l-4 border-l-yellow-500">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {userCounts.suspended}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Suspended</div>
        </Card>
        <Card className="text-center border-l-4 border-l-purple-500">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {userCounts.mfaEnabled}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">MFA Enabled</div>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users size={20} className="text-blue-600" />
              <span>User Directory ({filteredUsers.length})</span>
            </CardTitle>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={UserPlus}
            >
              Add User
            </Button>
          </div>
        </CardHeader>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="analyst">Analyst</option>
            <option value="maintenance">Maintenance</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            icon={Filter}
          >
            Clear Filters
          </Button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">User</th>
                <th className="text-left py-3 px-2">Role</th>
                <th className="text-left py-3 px-2">Department</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">MFA</th>
                <th className="text-center py-3 px-2">Last Login</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.username} • {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                    {user.department}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center">
                      {user.mfaEnabled ? (
                        <Shield size={16} className="text-green-600" />
                      ) : (
                        <Shield size={16} className="text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                    {formatTime(user.lastLogin)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex space-x-1 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user.id)}
                        icon={Edit}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        icon={Trash2}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield size={20} className="text-green-600" />
            <span>Active User Sessions ({activeSessions.length})</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {activeSessions.map((session) => {
            const user = users.find(u => u.id === session.userId);
            
            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{session.ipAddress}</span>
                      <span>•</span>
                      <span>{session.location}</span>
                      <span>•</span>
                      <span>{session.userAgent}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Started: {formatTime(session.startTime)}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Last activity: {formatTime(session.lastActivity)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Terminate
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {activeSessions.length === 0 && (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Active Sessions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No users are currently logged in.
            </p>
          </div>
        )}
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              placeholder="Enter username"
            />
            <Input
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="viewer">Viewer</option>
                <option value="operator">Operator</option>
                <option value="analyst">Analyst</option>
                <option value="maintenance">Maintenance</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Input
              label="Department"
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              placeholder="Enter department"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateUser}
              disabled={!newUser.username || !newUser.email || !newUser.firstName || !newUser.lastName}
            >
              Create User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};