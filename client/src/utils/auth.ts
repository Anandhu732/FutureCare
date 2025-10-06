// Admin authentication and security utilities

export interface AdminSession {
  admin: {
    email: string;
    name: string;
    id: string;
    role: "admin" | "super-admin";
  };
  token: string;
  expires: number;
  permissions: string[];
}

export interface UserSession {
  user: {
    email: string;
    name: string;
    id: string;
  };
  token: string;
  expires: number;
  provider?: string;
}

/**
 * Get current admin session from localStorage
 * Returns null if no valid admin session exists
 */
export function getAdminSession(): AdminSession | null {
  try {
    const sessionData = localStorage.getItem("futurecare_admin_session");
    if (sessionData) {
      const session: AdminSession = JSON.parse(sessionData);
      if (session.expires > Date.now()) {
        return session;
      } else {
        localStorage.removeItem("futurecare_admin_session");
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting admin session:", error);
    localStorage.removeItem("futurecare_admin_session");
    return null;
  }
}

/**
 * Get current user session from localStorage
 * Returns null if no valid user session exists
 */
export function getUserSession(): UserSession | null {
  try {
    const sessionData = localStorage.getItem("futurecare_session");
    if (sessionData) {
      const session: UserSession = JSON.parse(sessionData);
      if (session.expires > Date.now()) {
        return session;
      } else {
        localStorage.removeItem("futurecare_session");
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting user session:", error);
    localStorage.removeItem("futurecare_session");
    return null;
  }
}

/**
 * Check if current user has admin privileges
 * This ensures strict separation between admin and regular users
 */
export function isAdmin(): boolean {
  const adminSession = getAdminSession();
  const userSession = getUserSession();

  // Ensure the user is NOT logged in as a regular user when accessing admin
  // This prevents session confusion and ensures proper separation
  if (userSession) {
    console.warn("Regular user session detected while checking admin access");
    return false;
  }

  return adminSession !== null;
}

/**
 * Check if current admin has specific permission
 */
export function hasPermission(permission: string): boolean {
  const adminSession = getAdminSession();
  if (!adminSession) return false;

  // Super admin has all permissions
  if (adminSession.permissions.includes("*")) return true;

  return adminSession.permissions.includes(permission);
}

/**
 * Check if current admin has super admin privileges
 */
export function isSuperAdmin(): boolean {
  const adminSession = getAdminSession();
  return adminSession?.admin.role === "super-admin";
}

/**
 * Logout admin user
 */
export function logoutAdmin(): void {
  localStorage.removeItem("futurecare_admin_session");
}

/**
 * Logout regular user
 */
export function logoutUser(): void {
  localStorage.removeItem("futurecare_session");
}

/**
 * Ensure admin/user session separation
 * This function enforces that admin and user sessions cannot exist simultaneously
 */
export function enforceSessionSeparation(): void {
  const adminSession = getAdminSession();
  const userSession = getUserSession();

  if (adminSession && userSession) {
    console.warn("Detected simultaneous admin and user sessions - clearing user session for security");
    logoutUser();
  }
}

/**
 * Get appropriate redirect path based on current session
 */
export function getRedirectPath(): string {
  const adminSession = getAdminSession();
  const userSession = getUserSession();

  if (adminSession) return "/admin";
  if (userSession) return "/dashboard";
  return "/";
}

/**
 * Validate admin access and redirect if unauthorized
 * Returns true if access is granted, false if redirect is needed
 */
export function validateAdminAccess(): boolean {
  enforceSessionSeparation();
  return isAdmin();
}