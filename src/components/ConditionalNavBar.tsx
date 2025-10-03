"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function ConditionalNavBar() {
  const pathname = usePathname();

  // Hide navbar on dashboard, admin, and profile pages
  const hideNavbar = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin') || pathname?.startsWith('/profile');

  if (hideNavbar) {
    return null;
  }

  return (
    <>
      <NavBar />
      {/* Push content below navbar for non-dashboard pages */}
      <div className="pt-20" />
    </>
  );
}