import "./globals.css";
import { ReactNode } from "react";
import ConditionalNavBar from "../components/ConditionalNavBar";

export const metadata = {
  title: "FutureCare Booking",
  description: "Seamless hospital appointments and futuristic healthcare",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-black antialiased relative">
        <ConditionalNavBar />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
