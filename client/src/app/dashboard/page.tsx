"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useSwipeGesture,
  useDeviceCapabilities,

  MobileCard,
  MobileTabs,
  PullToRefresh
} from "../../utils/mobileUtils";
import {
  SkipNavLink,
  AccessibleButton,
  Toast,
  ScreenReaderOnly
} from "../../utils/accessibilityUtils";
import SmartHealthInsights from "../../components/SmartHealthInsights";
import AdvancedAppointments from "../../components/AdvancedAppointments";
import { HealthDashboardCharts } from "../../components/HealthCharts";
import NotificationCenter from "../../components/NotificationCenter";

interface UserSession {
  user: {
    email: string;
    name: string;
    id: string;
  };
  token: string;
  expires: number;
  provider?: string;
}

interface DashboardProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { isTouchDevice, isSmallScreen } = useDeviceCapabilities();

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "appointments", label: "My Appointments", icon: "📅" },
    { id: "book", label: "Book Appointment", icon: "➕" },
    { id: "medical-records", label: "Medical Records", icon: "📋" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const sidebarLinks = [
    { href: "/profile", label: "My Profile", icon: "👤" },
  ];

  // Swipe gestures for navigation
  useSwipeGesture(
    dashboardRef as React.RefObject<HTMLElement>,
    () => {
      // Swipe left - next tab
      if (isSmallScreen) {
        const currentIndex = sidebarItems.findIndex(item => item.id === activeTab);
        const nextIndex = (currentIndex + 1) % sidebarItems.length;
        setActiveTab(sidebarItems[nextIndex].id);
      }
    },
    () => {
      // Swipe right - previous tab or open sidebar
      if (!sidebarOpen && isSmallScreen) {
        setSidebarOpen(true);
      } else if (isSmallScreen) {
        const currentIndex = sidebarItems.findIndex(item => item.id === activeTab);
        const prevIndex = currentIndex === 0 ? sidebarItems.length - 1 : currentIndex - 1;
        setActiveTab(sidebarItems[prevIndex].id);
      }
    }
  );

  useEffect(() => {
    // Check for user session
    const sessionData = localStorage.getItem("futurecare_session");
    if (sessionData) {
      try {
        const session: UserSession = JSON.parse(sessionData);
        if (session.expires > Date.now()) {
          setUser(session);
          showToast('Welcome back!', 'success');
        } else {
          // Session expired
          localStorage.removeItem("futurecare_session");
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("futurecare_session");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("futurecare_session");
    showToast('You have been logged out', 'info');
    router.push("/");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    showToast('Dashboard refreshed', 'success');
    setIsRefreshing(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
          <ScreenReaderOnly>Please wait while the dashboard loads</ScreenReaderOnly>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <SkipNavLink />
      <div className="min-h-screen bg-gray-50" ref={dashboardRef}>
        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                setSidebarOpen(false);
              }
            }}
            aria-label="Close sidebar"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* Enhanced Fixed Sidebar */}
        <nav
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Mobile close button header - only shown on mobile */}
          <div className="flex items-center justify-end h-12 px-4 lg:hidden">
            <AccessibleButton
              onClick={() => setSidebarOpen(false)}
              variant="secondary"
              size="sm"
              className="p-2 !min-h-0"
              ariaLabel="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </AccessibleButton>
          </div>

          <div className="flex-1 px-3 py-6 overflow-y-auto lg:pt-8">
            <div className="space-y-2" role="menubar">
              {sidebarItems.map((item) => (
                <AccessibleButton
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                    showToast(`Switched to ${item.label}`, 'info');
                  }}
                  variant={activeTab === item.id ? "primary" : "secondary"}
                  fullWidth
                  className={`flex items-center justify-start px-4 py-3 text-left ${activeTab === item.id ? 'bg-black text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'} ${isTouchDevice ? 'min-h-[48px]' : ''}`}
                  ariaLabel={`Navigate to ${item.label}`}

                >
                  <span className="text-xl mr-3" aria-hidden="true">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </AccessibleButton>
              ))}

              {/* Navigation Links */}
              <div className="pt-2 border-t border-gray-200 mt-6">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${isTouchDevice ? 'min-h-[48px]' : ''}`}
                    aria-label={`Navigate to ${link.label}`}
                  >
                    <span className="text-xl mr-3" aria-hidden="true">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced User info at bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold"
                role="img"
                aria-label={`${user.user.name} profile picture`}
              >
                {user.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.user.email}
                </p>
              </div>
            </div>
            <AccessibleButton
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              fullWidth
              ariaLabel="Sign out of your account"
            >
              Sign Out
            </AccessibleButton>
          </div>
        </nav>

        {/* Main content area with proper margin for fixed sidebar */}
        <div className="lg:ml-64 min-h-screen">
          {/* Enhanced Mobile Header */}
          <header
            className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30"
            role="banner"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <AccessibleButton
                  onClick={() => setSidebarOpen(true)}
                  variant="secondary"
                  size="sm"
                  className={`p-2 lg:hidden !min-h-0 ${isTouchDevice ? 'min-w-[44px] min-h-[44px]' : ''}`}
                  ariaLabel="Open navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </AccessibleButton>
                <h1 className="text-xl font-bold text-gray-900 ml-2 truncate">
                  {sidebarItems.find(item => item.id === activeTab)?.label || "Dashboard"}
                </h1>
              </div>

              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <AccessibleButton
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  variant="secondary"
                  size="sm"
                  className={`p-2 relative !min-h-0 ${isTouchDevice ? 'min-w-[44px] min-h-[44px]' : ''}`}
                  ariaLabel="View notifications (2 unread)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" aria-hidden="true"></span>
                </AccessibleButton>

                {/* User menu */}
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm"
                    role="img"
                    aria-label={`${user.user.name} avatar`}
                  >
                    {user.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block truncate max-w-32">
                    {user.user.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            {isSmallScreen && (
              <div className="border-t border-gray-200 overflow-x-auto">
                <MobileTabs
                  tabs={sidebarItems}
                  activeTab={activeTab}
                  onChange={(tabId) => {
                    setActiveTab(tabId);
                    showToast(`Switched to ${sidebarItems.find(item => item.id === tabId)?.label}`, 'info');
                  }}
                  className="px-2"
                />
              </div>
            )}
          </header>

          {/* Notification Center */}
          <NotificationCenter
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            userId={user.user.id}
          />

          {/* Main content area with pull-to-refresh and consistent spacing */}
          <main id="main-content" className="min-h-screen bg-gray-50" role="main" aria-label="Dashboard content">
            <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
              <div className="p-4 lg:p-8 max-w-full">
                <div className="max-w-7xl mx-auto">
                  {children || <DashboardContent activeTab={activeTab} user={user} showToast={showToast} />}
                </div>
              </div>
            </PullToRefresh>
          </main>
        </div>
      </div>
    </>
  );
}

// Dashboard content component
function DashboardContent({
  activeTab,
  user,
  showToast
}: {
  activeTab: string;
  user: UserSession;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}) {
  switch (activeTab) {
    case "overview":
      return <OverviewTab user={user} showToast={showToast} />;
    case "appointments":
      return <AppointmentsTab showToast={showToast} user={user} />;
    case "book":
      return <BookAppointmentTab showToast={showToast} />;
    case "medical-records":
      return <MedicalRecordsTab showToast={showToast} />;
    case "settings":
      return <SettingsTab showToast={showToast} />;
    default:
      return <OverviewTab user={user} showToast={showToast} />;
  }
}

// Enhanced Overview Tab Component with Accessibility
function OverviewTab({
  user,
  showToast
}: {
  user: UserSession;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}) {
  const { isSmallScreen } = useDeviceCapabilities();

  const stats = [
    { label: "Upcoming Appointments", value: "2", icon: "📅", color: "blue" },
    { label: "Medical Records", value: "12", icon: "📋", color: "green" },
    { label: "Prescriptions", value: "3", icon: "💊", color: "purple" },
    { label: "Health Score", value: "85%", icon: "❤️", color: "red" },
  ];

  const recentActivity = [
    { action: "Appointment booked", details: "Dr. Sarah Johnson - Cardiology", time: "2 hours ago", icon: "📅" },
    { action: "Test results received", details: "Blood work - Normal ranges", time: "1 day ago", icon: "🧪" },
    { action: "Prescription refilled", details: "Lisinopril 10mg", time: "3 days ago", icon: "💊" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <MobileCard
        className="bg-gradient-to-r from-black to-gray-800 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 id="welcome-heading" className="text-2xl font-bold mb-1">
              Welcome back, {user.user.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-300">Here&apos;s your health overview today</p>
          </div>
          <div className="text-4xl" aria-hidden="true">👋</div>
        </div>
      </MobileCard>

      {/* Stats Grid - Responsive */}
      <section role="region" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Health Statistics Overview</h2>
        <div className={`grid gap-4 md:gap-6 ${isSmallScreen ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {stats.map((stat, index) => (
            <MobileCard
              key={index}
              className="text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-3xl mb-2" aria-hidden="true">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </MobileCard>
          ))}
        </div>
      </section>

      {/* Health Charts */}
      <section role="region" aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">Health Trends and Charts</h2>
        <HealthDashboardCharts userId={user.user.id} />
      </section>

      {/* Quick Actions */}
      <section role="region" aria-labelledby="actions-heading">
        <MobileCard>
          <h2 id="actions-heading" className="text-lg font-semibold mb-6">Quick Actions</h2>
          <div className={`grid gap-4 ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
            <AccessibleButton
              onClick={() => {
                showToast('Navigating to book appointment...', 'info');
                /* Navigate to book appointment */
              }}
              variant="primary"
              className="flex items-center justify-center"
              ariaLabel="Book a new appointment"
            >
              <span className="mr-2" aria-hidden="true">📅</span>
              Book Appointment
            </AccessibleButton>
            <AccessibleButton
              onClick={() => {
                showToast('Opening medical records...', 'info');
                /* Navigate to records */
              }}
              variant="secondary"
              className="flex items-center justify-center"
              ariaLabel="View your medical records"
            >
              <span className="mr-2" aria-hidden="true">📋</span>
              View Records
            </AccessibleButton>
            <AccessibleButton
              onClick={() => {
                showToast('Loading prescriptions...', 'info');
                /* Navigate to prescriptions */
              }}
              variant="secondary"
              className="flex items-center justify-center"
              ariaLabel="View your prescriptions"
            >
              <span className="mr-2" aria-hidden="true">💊</span>
              Prescriptions
            </AccessibleButton>
          </div>
        </MobileCard>
      </section>

      {/* Recent Activity */}
      <section role="region" aria-labelledby="activity-heading">
        <MobileCard>
          <h2 id="activity-heading" className="text-lg font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4" role="list">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
                role="listitem"
                tabIndex={0}
                aria-label={`${activity.action}: ${activity.details}, ${activity.time}`}
              >
                <div className="text-2xl flex-shrink-0" aria-hidden="true">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </MobileCard>
      </section>

      {/* AI Health Insights */}
      <section role="region" aria-labelledby="ai-insights-heading">
        <h2 id="ai-insights-heading" className="sr-only">AI-Powered Health Insights</h2>
        <SmartHealthInsights className="w-full" />
      </section>
    </div>
  );
}

// Enhanced Appointments Tab with AdvancedAppointments Component
function AppointmentsTab({
  user
}: {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  user: UserSession;
}) {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h2>
        <p className="text-gray-600">Manage and track all your healthcare appointments with advanced filtering and search.</p>
      </div>

      {/* Use the AdvancedAppointments component */}
      <AdvancedAppointments userId={user.user.id} />
    </div>
  );
}

// Placeholder components for other tabs
function BookAppointmentTab({
  showToast
}: {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}) {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book New Appointment</h2>
        <p className="text-gray-600">Schedule your next healthcare appointment with ease.</p>
      </div>
      <MobileCard>
        <div className="text-center py-8">
          <div className="text-4xl mb-4" aria-hidden="true">📅</div>
          <p className="text-gray-600 mb-6">Enhanced booking form with full accessibility features coming soon...</p>
          <AccessibleButton
            onClick={() => showToast('Form feature in development', 'info')}
            variant="primary"
            ariaLabel="Start booking process"
          >
            Start Booking
          </AccessibleButton>
        </div>
      </MobileCard>
    </div>
  );
}

function MedicalRecordsTab({
  showToast
}: {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}) {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Records</h2>
        <p className="text-gray-600">Your medical history and documents will appear here.</p>
      </div>
      <MobileCard>
        <div className="text-center py-8">
          <div className="text-4xl mb-4" aria-hidden="true">📋</div>
          <p className="text-gray-600 mb-6">No medical records available yet.</p>
          <AccessibleButton
            onClick={() => showToast('Loading medical records...', 'info')}
            variant="primary"
            ariaLabel="Load medical records"
          >
            Load Records
          </AccessibleButton>
        </div>
      </MobileCard>
    </div>
  );
}

function SettingsTab({
  showToast
}: {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}) {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account and application preferences.</p>
      </div>
      <MobileCard>
        <div className="text-center py-8">
          <div className="text-4xl mb-4" aria-hidden="true">⚙️</div>
          <p className="text-gray-600 mb-6">Settings panel is currently being developed.</p>
          <AccessibleButton
            onClick={() => showToast('Settings panel in development', 'info')}
            variant="primary"
            ariaLabel="Open settings"
          >
            Open Settings
          </AccessibleButton>
        </div>
      </MobileCard>
    </div>
  );
}