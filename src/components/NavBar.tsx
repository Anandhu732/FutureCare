"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        }
      } catch {
        localStorage.removeItem("futurecare_session");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("futurecare_session");
    setUser(null);
    router.push("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-20 flex items-center justify-between h-20">
        <Link href="/">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black hover:text-black transition">
            FutureCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-lg font-medium text-black items-center">
          {user ? (
            // Authenticated Navigation
            <>
              <Link href="/dashboard" className="hover:text-black transition">
                Dashboard
              </Link>
              <Link href="/features" className="hover:text-black transition">
                Features
              </Link>
              <Link href="/contact" className="hover:text-black transition">
                Contact
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{user.user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-black transition px-3 py-1 rounded-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Non-authenticated Navigation
            <>
              <Link href="/features" className="hover:text-black transition">
                Features
              </Link>
              <Link href="/contact" className="hover:text-black transition">
                Contact
              </Link>
              <Link href="/login" className="hover:text-black transition">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.user.name}</p>
                    <p className="text-sm text-gray-600">{user.user.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" className="block text-gray-900 hover:text-black transition" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/features" className="block text-gray-900 hover:text-black transition" onClick={() => setIsMenuOpen(false)}>
                  Features
                </Link>
                <Link href="/contact" className="block text-gray-900 hover:text-black transition" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-600 hover:text-black transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/features" className="block text-gray-900 hover:text-black transition" onClick={() => setIsMenuOpen(false)}>
                  Features
                </Link>
                <Link href="/contact" className="block text-gray-900 hover:text-black transition" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <Link href="/login" className="block text-gray-900 hover:text-black transition" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
