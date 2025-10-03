"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface UserSession {
  user: {
    email: string;
    name: string;
    id: string;
    role?: string;
  };
  token: string;
  expires: number;
  provider?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  adminOnly?: boolean;
}

interface DashboardNavBarProps {
  user: UserSession;
  onLogout: () => void;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  sidebarItems?: NavItem[];
  externalLinks?: NavItem[];
  notificationCount?: number;
}

export default function DashboardNavBar({
  user,
  onLogout,
  activeTab,
  onTabChange,
  sidebarItems = [],
  externalLinks = [],
  notificationCount = 0,
}: DashboardNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Default navigation items if none provided
  const defaultSidebarItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "appointments", label: "My Appointments", icon: "📅" },
    { id: "book", label: "Book Appointment", icon: "➕" },
    { id: "medical-records", label: "Medical Records", icon: "📋" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const defaultExternalLinks: NavItem[] = [
    { id: "profile", label: "My Profile", icon: "👤", href: "/profile" },
    { id: "admin", label: "Admin Panel", icon: "🔧", href: "/admin", adminOnly: true },
  ];

  const items = sidebarItems.length > 0 ? sidebarItems : defaultSidebarItems;
  const links = externalLinks.length > 0 ? externalLinks : defaultExternalLinks;

  // Filter admin-only items based on user role
  const visibleLinks = links.filter(link =>
    !link.adminOnly || user.user.role === 'admin'
  );

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('dashboard-sidebar');
      const menuButton = document.getElementById('menu-button');

      if (sidebarOpen && sidebar && menuButton &&
          !sidebar.contains(event.target as Node) &&
          !menuButton.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleItemClick = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.onClick) {
      item.onClick();
    } else if (onTabChange) {
      onTabChange(item.id);
    }
    setSidebarOpen(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-center h-20 border-b border-gray-200 bg-white">
          <Link
            href="/"
            className="text-2xl font-extrabold text-black hover:text-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label="FutureCare Home"
          >
            FutureCare
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1" role="navigation" aria-label="Dashboard navigation">
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 group ${
                  activeTab === item.id
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-current={activeTab === item.id ? "page" : undefined}
                role="tab"
              >
                <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* External Navigation Links */}
            {visibleLinks.length > 0 && (
              <div className="pt-4 border-t border-gray-200 mt-6">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Links
                </p>
                {visibleLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleItemClick(link)}
                    className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 group"
                  >
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.label}</span>
                    {link.adminOnly && (
                      <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              {user.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.user.email}
              </p>
              {user.user.role && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                  {user.user.role}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 flex items-center justify-center"
            aria-label="Sign out of your account"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              id="menu-button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200"
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 ml-2">
              {items.find(item => item.id === activeTab)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg relative focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200"
                aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
                aria-expanded={showNotifications}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown - Placeholder for now */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
                    <p className="text-sm text-gray-600">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Name */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                {user.user.name.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                {user.user.name}
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}