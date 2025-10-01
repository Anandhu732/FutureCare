import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "FutureCare Booking",
  description: "Seamless hospital appointments and futuristic healthcare",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-black antialiased relative">
        <NavBar />
        {/* Push content below navbar */}
        <div className="pt-20 min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
