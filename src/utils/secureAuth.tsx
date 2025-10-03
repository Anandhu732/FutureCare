"use client";

import { useState, useEffect } from "react";

// Enhanced session management with security features
export interface UserSession {
  user: {
    email: string;
    name: string;
    id: string;
    role: 'user' | 'admin' | 'doctor';
    permissions: string[];
    profileImage?: string;
    lastLogin?: string;
  };
  token: string;
  expires: number;
  refreshToken?: string;
  provider?: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionValidationResult {
  isValid: boolean;
  user?: UserSession['user'];
  needsRefresh?: boolean;
  error?: string;
}

export class SecureSessionManager {
  private static readonly SESSION_KEY = 'futurecare_session';
  private static readonly REFRESH_THRESHOLD = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Validate current session
  static validateSession(): SessionValidationResult {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) {
        return { isValid: false, error: 'No session found' };
      }

      const session: UserSession = JSON.parse(sessionData);
      const now = Date.now();

      // Check if session has expired
      if (session.expires <= now) {
        this.clearSession();
        return { isValid: false, error: 'Session expired' };
      }

      // Check if session needs refresh (30 minutes before expiry)
      const needsRefresh = (session.expires - now) < this.REFRESH_THRESHOLD;

      // Validate session structure
      if (!session.user || !session.token || !session.sessionId) {
        this.clearSession();
        return { isValid: false, error: 'Invalid session structure' };
      }

      return {
        isValid: true,
        user: session.user,
        needsRefresh
      };
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearSession();
      return { isValid: false, error: 'Session validation failed' };
    }
  }

  // Create new session
  static createSession(userData: {
    email: string;
    name: string;
    id: string;
    role?: 'user' | 'admin' | 'doctor';
    permissions?: string[];
  }, provider?: string): UserSession {
    const session: UserSession = {
      user: {
        email: userData.email,
        name: userData.name,
        id: userData.id,
        role: userData.role || 'user',
        permissions: userData.permissions || this.getDefaultPermissions(userData.role || 'user'),
        lastLogin: new Date().toISOString()
      },
      token: this.generateSecureToken(),
      expires: Date.now() + this.MAX_SESSION_DURATION,
      refreshToken: this.generateSecureToken(),
      provider,
      sessionId: this.generateSessionId(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return session;
  }

  // Refresh session
  static async refreshSession(): Promise<boolean> {
    try {
      const validation = this.validateSession();
      if (!validation.isValid || !validation.user) {
        return false;
      }

      const currentSession = this.getCurrentSession();
      if (!currentSession) return false;

      // Simulate API call for token refresh
      await new Promise(resolve => setTimeout(resolve, 500));

      const refreshedSession: UserSession = {
        ...currentSession,
        token: this.generateSecureToken(),
        expires: Date.now() + this.MAX_SESSION_DURATION,
        user: {
          ...currentSession.user,
          lastLogin: new Date().toISOString()
        }
      };

      localStorage.setItem(this.SESSION_KEY, JSON.stringify(refreshedSession));
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  }

  // Get current session
  static getCurrentSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  }

  // Clear session
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    // Also clear any other session-related data
    localStorage.removeItem('pendingAppointment');
  }

  // Check if user has permission
  static hasPermission(permission: string): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    return session.user.permissions.includes(permission) ||
           session.user.role === 'admin'; // Admin has all permissions
  }

  // Check if user has role
  static hasRole(role: string): boolean {
    const session = this.getCurrentSession();
    return session?.user.role === role;
  }

  // Get default permissions for role
  private static getDefaultPermissions(role: string): string[] {
    switch (role) {
      case 'admin':
        return [
          'read:all',
          'write:all',
          'delete:all',
          'manage:users',
          'manage:appointments',
          'view:analytics',
          'manage:system'
        ];
      case 'doctor':
        return [
          'read:patients',
          'write:medical-records',
          'read:appointments',
          'write:appointments',
          'read:prescriptions',
          'write:prescriptions'
        ];
      case 'user':
      default:
        return [
          'read:own-data',
          'write:own-profile',
          'book:appointments',
          'view:own-records'
        ];
    }
  }

  // Generate secure token (in production, this would be JWT or similar)
  private static generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate session ID
  private static generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get client IP (simplified - in production you'd use server-side detection)
  private static getClientIP(): string {
    // This is a placeholder - real IP detection requires server-side logic
    return 'unknown';
  }

  // Auto-refresh session when needed
  static startAutoRefresh(): void {
    const checkInterval = 5 * 60 * 1000; // Check every 5 minutes

    setInterval(async () => {
      const validation = this.validateSession();
      if (validation.isValid && validation.needsRefresh) {
        console.log('Auto-refreshing session...');
        await this.refreshSession();
      }
    }, checkInterval);
  }

  // Log security event (in production, send to security monitoring)
  static logSecurityEvent(event: string, details?: Record<string, unknown>): void {
    const session = this.getCurrentSession();
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId: session?.user.id,
      sessionId: session?.sessionId,
      details,
      userAgent: navigator.userAgent
    };

    console.log('Security Event:', logEntry);
    // In production, send to security monitoring service
  }
}

// Role-based access control hook
export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validation = SecureSessionManager.validateSession();
    if (validation.isValid) {
      const currentSession = SecureSessionManager.getCurrentSession();
      setSession(currentSession);

      // Start auto-refresh
      SecureSessionManager.startAutoRefresh();
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; name: string; id: string; role?: 'user' | 'admin' | 'doctor'; permissions?: string[] }) => {
    // Simulate login logic
    const session = SecureSessionManager.createSession(credentials);
    setSession(session);
    SecureSessionManager.logSecurityEvent('user_login', { userId: session.user.id });
    return session;
  };

  const logout = () => {
    if (session) {
      SecureSessionManager.logSecurityEvent('user_logout', { userId: session.user.id });
    }
    SecureSessionManager.clearSession();
    setSession(null);
  };

  const hasPermission = (permission: string) => {
    return SecureSessionManager.hasPermission(permission);
  };

  const hasRole = (role: string) => {
    return SecureSessionManager.hasRole(role);
  };

  return {
    session,
    loading,
    login,
    logout,
    hasPermission,
    hasRole,
    isAuthenticated: !!session,
    user: session?.user
  };
}

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback
}: ProtectedRouteProps) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return fallback || (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (requiredRole && !SecureSessionManager.hasRole(requiredRole)) {
    return fallback || (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Insufficient Permissions</h1>
          <p className="text-gray-600">You don&apos;t have the required role to access this page.</p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !SecureSessionManager.hasPermission(requiredPermission)) {
    return fallback || (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600">You don&apos;t have permission to view this content.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}