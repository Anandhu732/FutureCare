"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // Scroll tracking for future animations (prepared for enhancements)
  useEffect(() => {
    const handleScroll = () => {
      // Future: Add scroll-based animations here
      // const scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans bg-white text-black min-h-screen overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-4 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
          <div className="absolute top-1/3 -right-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-6 sm:px-8 max-w-5xl mx-auto">
          {/* Medical Cross Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24 bg-black rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tight mb-6 text-black leading-tight">
            FutureCare
          </h1>
          <p className="text-xl sm:text-2xl mb-4 text-gray-600 font-medium">
            Healthcare Reimagined
          </p>
          <p className="text-lg sm:text-xl max-w-3xl mb-12 text-gray-700 leading-relaxed">
            Experience seamless healthcare booking with real-time availability, instant confirmations,
            and world-class medical professionals—all at your fingertips.
          </p>

          <div className="flex justify-center">
            <Link
              href="/book-appointment"
              className="group bg-black text-white px-12 py-4 rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              Book Now
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Trusted by Healthcare Leaders</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-300">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Medical Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-300">Uptime Reliability</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold">MedTech</div>
              <div className="text-2xl font-bold">HealthCorp</div>
              <div className="text-2xl font-bold">CareSystem</div>
              <div className="text-2xl font-bold">MediFlow</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose FutureCare?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re revolutionizing healthcare access with cutting-edge technology and human-centered design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group text-center hover:scale-105 transition-transform duration-300">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-black rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Instant Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Schedule appointments in seconds with our intuitive interface. No more waiting on hold or playing phone tag with reception.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center hover:scale-105 transition-transform duration-300">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Real-Time Availability</h3>
              <p className="text-gray-600 leading-relaxed">
                See which doctors are available right now and pick your perfect time slot. Live updates ensure accuracy and convenience.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center hover:scale-105 transition-transform duration-300">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-gray-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Secure & Reliable</h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is protected with industry-leading security. HIPAA compliant with 256-bit encryption and secure cloud storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-16 h-16 text-gray-600 mx-auto opacity-50" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h6V14c0-2.2 1.8-4 4-4h2V8h-6zm12 0c-3.3 0-6 2.7-6 6v10h6V14c0-2.2 1.8-4 4-4h2V8h-6z"/>
              </svg>
            </div>

            <blockquote className="text-3xl sm:text-4xl font-light text-gray-800 mb-8 leading-relaxed">
              &ldquo;FutureCare transformed how I manage my family&apos;s healthcare. Booking appointments is now effortless,
              and the doctors are exceptional. It&apos;s like having a personal healthcare concierge.&rdquo;
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SJ</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-black text-lg">Sarah Johnson</div>
                <div className="text-gray-600">Mother of two, Software Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 sm:px-8">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl sm:text-2xl mb-12 opacity-90 leading-relaxed">
            Join thousands of patients who have already discovered the future of healthcare booking
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/book-appointment"
              className="group bg-white text-black px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              Start Your Journey Today
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="group border-2 border-white text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center"
            >
              Sign In
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">⚡</div>
              <div className="text-sm opacity-80">Lightning Fast Booking</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">🔒</div>
              <div className="text-sm opacity-80">100% Secure & Private</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">🏥</div>
              <div className="text-sm opacity-80">Loved by Patients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">FutureCare</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Revolutionizing healthcare access through innovative technology and exceptional patient care.
                Your health, our priority.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <span className="sr-only">Twitter</span>
                  📱
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  💼
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/book-appointment" className="text-gray-400 hover:text-white transition-colors">Book Appointment</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Patient Login</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 FutureCare. All rights reserved. | Empowering healthier communities.
            </p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <span className="text-gray-400 text-sm">🏥 HIPAA Compliant</span>
              <span className="text-gray-400 text-sm">🔒 SOC 2 Certified</span>
              <span className="text-gray-400 text-sm">⚡ 99.9% Uptime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
