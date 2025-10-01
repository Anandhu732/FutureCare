"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-20 flex items-center justify-between h-20">
        <Link href="/">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black hover:text-black transition">
            FutureCare
          </span>
        </Link>
        <div className="hidden md:flex gap-8 text-lg font-medium text-black">
          <Link href="/book-appointment" className="hover:text-black transition">
            Book Appointment
          </Link>
          <Link href="/features" className="hover:text-black transition">
            Features
          </Link>
          <Link href="/contact" className="hover:text-black transition">
            Contact
          </Link>
          <Link href="#login" className="hover:text-black transition">
             Login
          </Link>
        </div>
        <div className="md:hidden">
          <button className="text-black focus:outline-none">
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
    </nav>
  );
}
