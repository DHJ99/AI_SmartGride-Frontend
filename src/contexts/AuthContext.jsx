import React, { createContext, useContext, useState, useEffect } from 'react';
import { logLoginAttempt, logSecurityEvent, logSecurityWarning } from '@/utils/securityLogger';
import { authClient } from '@/services/authClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000; // 1 hour
  const MAX_LOGIN_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;

  useEffect(() => {
    // Restore session from server
    (async () => {
      try {
        const me = await authClient.me();
        if (me) {
          setUser(me);
          logSecurityEvent('session_restored', { userId: me.id });
        }
      } catch (e) {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // Set up session timeout
    if (user) {
      setupSessionTimeout();
    } else {
      clearSessionTimeout();
    }
  }, [user]);

  const checkExistingSession = () => {};

  const setupSessionTimeout = () => {
    clearSessionTimeout();
    
    const timeoutId = setTimeout(() => {
      logout('session_timeout');
    }, SESSION_TIMEOUT);
    
    setSessionTimeout(timeoutId);
  };

  const clearSessionTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      
      // Check login attempts
      const attempts = getLoginAttempts(email);
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      const me = await authClient.login(email, password);
      setUser(me);
      clearLoginAttempts(email);
      logLoginAttempt(email, true, { userId: me.id, rememberMe });
      return { success: true, user: me };
    } catch (error) {
      incrementLoginAttempts(email);
      logLoginAttempt(email, false, { error: error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (reason = 'user_logout') => {
    const userId = user?.id;
    await authClient.logout();
    clearSession();
    setUser(null);
    logSecurityEvent('logout', { userId, reason, sessionDuration: getSessionDuration() });
  };

  const clearSession = () => {
    clearSessionTimeout();
  };

  const getSessionDuration = () => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('userSession') || '{}');
      if (sessionData.loginTime) {
        return Date.now() - sessionData.loginTime;
      }
    } catch (error) {
      console.error('Error calculating session duration:', error);
    }
    return 0;
  };

  const refreshSession = () => {
    if (user) {
      setupSessionTimeout();
      logSecurityEvent('session_refreshed', { userId: user.id });
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'viewer': 1,
      'analyst': 2,
      'operator': 3,
      'admin': 4
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission) || user.role === 'admin';
  };

  // Helper functions for login attempts tracking
  const getLoginAttempts = (email) => {
    const attempts = localStorage.getItem(`login_attempts_${email}`);
    return attempts ? parseInt(attempts) : 0;
  };

  const incrementLoginAttempts = (email) => {
    const attempts = getLoginAttempts(email) + 1;
    localStorage.setItem(`login_attempts_${email}`, attempts.toString());
    
    // Clear attempts after 15 minutes
    setTimeout(() => {
      localStorage.removeItem(`login_attempts_${email}`);
    }, 15 * 60 * 1000);
  };

  const clearLoginAttempts = (email) => {
    localStorage.removeItem(`login_attempts_${email}`);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    refreshSession,
    hasRole,
    hasPermission,
    sessionTimeout: sessionTimeout ? SESSION_TIMEOUT : 0
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// removed mockLogin; handled by services/authClient