import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans bg-white text-black min-h-screen flex flex-col relative overflow-hidden">

      {/* Futuristic Hero Background */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e0e0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            fill="url(#grad)"
            d="M0,64L48,96C96,128,192,192,288,197.3C384,203,480,149,576,122.7C672,96,768,96,864,106.7C960,117,1056,139,1152,165.3C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-24 px-6 sm:px-20">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4">
          FutureCare Booking
        </h1>
        <p className="text-lg sm:text-2xl max-w-xl mb-10 text-gray-700">
          Seamless hospital appointments, real-time availability, and futuristic healthcare at your fingertips.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <a
            href="/book-appointment"
            className="rounded-full bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition"
          >
            Book Appointment
          </a>
          <a
            href="#learn-more"
            className="rounded-full border border-black px-8 py-3 text-lg font-semibold hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </header>

      {/* Features Section */}
      <main className="flex flex-col sm:flex-row justify-around items-center text-center sm:text-left gap-16 py-24 px-6 sm:px-20">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="w-16 h-16 mx-auto sm:mx-0 mb-2">
            <Image src="/icons/booking.svg" alt="Booking Icon" width={64} height={64} />
          </div>
          <h2 className="text-2xl font-bold">Instant Booking</h2>
          <p className="text-gray-600">
            Schedule appointments in seconds with our intuitive interface.
          </p>
        </div>
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="w-16 h-16 mx-auto sm:mx-0 mb-2">
            <Image src="/icons/availability.svg" alt="Availability Icon" width={64} height={64} />
          </div>
          <h2 className="text-2xl font-bold">Real-Time Availability</h2>
          <p className="text-gray-600">
            See which doctors are available and pick a slot instantly.
          </p>
        </div>
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="w-16 h-16 mx-auto sm:mx-0 mb-2">
            <Image src="/icons/security.svg" alt="Security Icon" width={64} height={64} />
          </div>
          <h2 className="text-2xl font-bold">Secure & Reliable</h2>
          <p className="text-gray-600">
            Your health data is protected with industry-leading security.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-20 py-8 border-t border-gray-200 text-gray-700">
        <p>© 2025 FutureCare. All rights reserved.</p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}
