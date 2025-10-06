"use client";

import { useState, useEffect } from "react";

interface AdminSession {
  admin: {
    email: string;
    name: string;
    id: string;
    role: string;
  };
  token: string;
  expires: number;
  permissions: string[];
}

export default function AdminAnalytics() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    try {
      const adminSessionData = localStorage.getItem("futurecare_admin_session");
      if (adminSessionData) {
        const session: AdminSession = JSON.parse(adminSessionData);
        if (session.expires > Date.now()) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem("futurecare_admin_session");
        }
      }
      setIsAuthenticated(false);
      setLoading(false);
    } catch (error) {
      console.error("Error checking admin auth:", error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Admin authentication logic - in real app this would be server-side
      if (email === "admin@futurecare.com" && password === "admin123") {
        const adminSession: AdminSession = {
          admin: {
            email: "admin@futurecare.com",
            name: "System Administrator",
            id: "admin_001",
            role: "admin"
          },
          token: `admin_token_${Date.now()}`,
          expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          permissions: ["view_users", "manage_appointments", "system_settings", "user_management"]
        };

        localStorage.setItem("futurecare_admin_session", JSON.stringify(adminSession));
        setIsAuthenticated(true);
      } else if (email === "superadmin@futurecare.com" && password === "superadmin456") {
        const adminSession: AdminSession = {
          admin: {
            email: "superadmin@futurecare.com",
            name: "Super Administrator",
            id: "superadmin_001",
            role: "super-admin"
          },
          token: `superadmin_token_${Date.now()}`,
          expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          permissions: ["*"] // All permissions
        };

        localStorage.setItem("futurecare_admin_session", JSON.stringify(adminSession));
        setIsAuthenticated(true);
      } else {
        setError("Invalid admin credentials");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("futurecare_admin_session");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Authorized personnel only
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300">
                Admin Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10"
                placeholder="admin@futurecare.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : (
                "Sign in to Admin Panel"
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-300 space-y-1">
              <div>Admin: admin@futurecare.com / admin123</div>
              <div>Super Admin: superadmin@futurecare.com / superadmin456</div>
            </div>
          </div>
        </form>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm text-yellow-400 font-medium">Restricted Access</p>
              <p className="text-xs text-yellow-300 mt-1">
                This area is restricted to authorized administrators only. All access attempts are logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem("futurecare_admin_session");
    if (sessionData) {
      try {
        setAdminSession(JSON.parse(sessionData));
      } catch (error) {
        console.error("Error parsing admin session:", error);
        onLogout();
      }
    }
  }, [onLogout]);

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Dashboard", icon: "📊" },
    { id: "users", name: "User Management", icon: "👥" },
    { id: "appointments", name: "Appointments", icon: "📅" },
    { id: "analytics", name: "Analytics", icon: "📈" },
    { id: "settings", name: "System Settings", icon: "⚙️" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-600 rounded flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">FutureCare Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{adminSession.admin.name}</p>
                <p className="text-xs text-gray-400 capitalize">{adminSession.admin.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "appointments" && <AppointmentManagement />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "settings" && <SystemSettings />}
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Components
function AdminOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 5a4 4 0 110 8m-6-3a4 4 0 118 0m0-10a4 4 0 110 8" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Appointments Today</p>
              <p className="text-2xl font-bold text-white">47</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Pending Reviews</p>
              <p className="text-2xl font-bold text-white">23</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">System Alerts</p>
              <p className="text-2xl font-bold text-white">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-300">New user registration: john.doe@email.com</span>
            <span className="text-gray-500 ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-300">Appointment scheduled with Dr. Smith</span>
            <span className="text-gray-500 ml-auto">15 minutes ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-gray-300">System backup completed successfully</span>
            <span className="text-gray-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          Add New User
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      J
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">John Doe</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">john.doe@email.com</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">2024-01-15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-400 hover:text-blue-300">Edit</button>
                  <button className="text-red-400 hover:text-red-300">Suspend</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      S
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">Sarah Wilson</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">sarah.wilson@email.com</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">2024-01-10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-400 hover:text-blue-300">Edit</button>
                  <button className="text-red-400 hover:text-red-300">Suspend</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AppointmentManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Appointment Management</h2>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Appointments</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <p className="text-white font-medium">Dr. Smith - John Doe</p>
              <p className="text-gray-400 text-sm">General Consultation</p>
            </div>
            <div className="text-right">
              <p className="text-white">10:00 AM</p>
              <span className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded-full">Confirmed</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <p className="text-white font-medium">Dr. Johnson - Sarah Wilson</p>
              <p className="text-gray-400 text-sm">Follow-up Visit</p>
            </div>
            <div className="text-right">
              <p className="text-white">2:30 PM</p>
              <span className="px-2 py-1 text-xs bg-yellow-900 text-yellow-300 rounded-full">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
          <div className="h-48 flex items-center justify-center text-gray-400">
            <p>Chart placeholder - User growth over time</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Appointment Trends</h3>
          <div className="h-48 flex items-center justify-center text-gray-400">
            <p>Chart placeholder - Appointment booking trends</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
              <input
                type="text"
                value="FutureCare"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <input
                type="email"
                value="admin@futurecare.com"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Two-Factor Authentication</span>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Session Timeout</span>
              <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-red-500">
                <option>24 hours</option>
                <option>12 hours</option>
                <option>8 hours</option>
                <option>4 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Login Attempts Limit</span>
              <input
                type="number"
                defaultValue="5"
                className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">IP Whitelist</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">Database</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">API Services</p>
            <p className="text-xs text-green-400">Operational</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">Email Service</p>
            <p className="text-xs text-yellow-400">Maintenance</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">Security</p>
            <p className="text-xs text-green-400">Protected</p>
          </div>
        </div>
      </div>

      {/* Backup & Maintenance */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Backup & Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Last Backup</p>
              <p className="text-sm text-gray-500">2024-01-20 03:00 AM</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Run Backup Now
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">System Update</p>
              <p className="text-sm text-gray-500">Version 2.1.0 available</p>
            </div>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Update System
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Currently disabled</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Enable Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">99.9%</div>
            <p className="text-sm text-gray-400">Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">2.3s</div>
            <p className="text-sm text-gray-400">Avg Response Time</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">45GB</div>
            <p className="text-sm text-gray-400">Storage Used</p>
          </div>
        </div>
      </div>
    </div>
  );
}