import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logPermissionDenied } from '@/utils/securityLogger';

export function RoleBasedAccess({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallback = null,
  hideIfNoAccess = false 
}) {
  const { user, hasRole, hasPermission } = useAuth();

  if (!user) {
    return hideIfNoAccess ? null : fallback;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    if (hideIfNoAccess) {
      return null;
    }
    
    logPermissionDenied('component_access', requiredRole, user.role, {
      component: 'RoleBasedAccess'
    });
    
    return fallback || (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          Access denied. Required role: {requiredRole}
        </p>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (hideIfNoAccess) {
      return null;
    }
    
    logPermissionDenied('permission_access', requiredPermission, user.permissions, {
      component: 'RoleBasedAccess'
    });
    
    return fallback || (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          Insufficient permissions. Required: {requiredPermission}
        </p>
      </div>
    );
  }

  return children;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback = null, hideIfNoAccess = false }) {
  return (
    <RoleBasedAccess 
      requiredRole="admin" 
      fallback={fallback}
      hideIfNoAccess={hideIfNoAccess}
    >
      {children}
    </RoleBasedAccess>
  );
}

export function OperatorOnly({ children, fallback = null, hideIfNoAccess = false }) {
  return (
    <RoleBasedAccess 
      requiredRole="operator" 
      fallback={fallback}
      hideIfNoAccess={hideIfNoAccess}
    >
      {children}
    </RoleBasedAccess>
  );
}

export function WriteAccess({ children, fallback = null, hideIfNoAccess = false }) {
  return (
    <RoleBasedAccess 
      requiredPermission="write" 
      fallback={fallback}
      hideIfNoAccess={hideIfNoAccess}
    >
      {children}
    </RoleBasedAccess>
  );
}

export function DeleteAccess({ children, fallback = null, hideIfNoAccess = false }) {
  return (
    <RoleBasedAccess 
      requiredPermission="delete" 
      fallback={fallback}
      hideIfNoAccess={hideIfNoAccess}
    >
      {children}
    </RoleBasedAccess>
  );
}