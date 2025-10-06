"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserProfile from "../../components/user/UserProfile";

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

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user session
    const sessionData = localStorage.getItem("futurecare_session");
    if (sessionData) {
      try {
        const session: UserSession = JSON.parse(sessionData);
        if (session.expires > Date.now()) {
          setUser(session);
        } else {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <span className="mt-4 text-gray-600 font-medium">Loading your profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      {/* Clean Profile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.user.name}</p>
                <p className="text-xs text-gray-500">{user.user.email}</p>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                {user.user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserProfile />
      </main>
    </div>
  );
}