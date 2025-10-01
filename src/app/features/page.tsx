import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: "🏥",
      title: "Instant Booking",
      description: "Schedule appointments in seconds with our intuitive interface. No waiting on hold or complex forms.",
      benefits: ["24/7 online booking", "Real-time availability", "Instant confirmation"]
    },
    {
      icon: "⏰",
      title: "Real-Time Availability",
      description: "See which doctors and time slots are available instantly. Never worry about double-booking again.",
      benefits: ["Live calendar updates", "Multiple location support", "Flexible scheduling"]
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description: "Your health data is protected with industry-leading security and HIPAA compliance.",
      benefits: ["End-to-end encryption", "HIPAA compliant", "Secure data storage"]
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Book appointments on any device. Our responsive design works perfectly on phones, tablets, and desktops.",
      benefits: ["Cross-platform compatibility", "Native app experience", "Offline capabilities"]
    },
    {
      icon: "🔔",
      title: "Smart Reminders",
      description: "Never miss an appointment with automatic reminders via email, SMS, and push notifications.",
      benefits: ["Multiple reminder options", "Customizable timing", "Automatic rescheduling"]
    },
    {
      icon: "💊",
      title: "Health Records Integration",
      description: "Seamlessly connect with your existing health records and medical history for better care.",
      benefits: ["EHR integration", "Medical history sync", "Prescription tracking"]
    },
    {
      icon: "🎯",
      title: "Specialist Matching",
      description: "Find the right specialist for your needs with our intelligent doctor matching system.",
      benefits: ["AI-powered matching", "Specialty filtering", "Doctor ratings & reviews"]
    },
    {
      icon: "💬",
      title: "Telemedicine Ready",
      description: "Connect with healthcare providers virtually through integrated video consultations.",
      benefits: ["HD video calls", "Screen sharing", "Digital prescriptions"]
    },
    {
      icon: "📊",
      title: "Health Analytics",
      description: "Track your health journey with comprehensive analytics and personalized insights.",
      benefits: ["Health trends", "Personalized insights", "Progress tracking"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Patients" },
    { number: "500+", label: "Healthcare Providers" },
    { number: "25", label: "Medical Specialties" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6">
            Revolutionizing Healthcare Access
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Discover how FutureCare is transforming the way you access healthcare with cutting-edge technology and patient-centered design.
          </p>
          <Link
            href="/book-appointment"
            className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition"
          >
            Experience FutureCare
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed with you in mind, making healthcare access simple, secure, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built with Cutting-Edge Technology
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform leverages the latest in healthcare technology, artificial intelligence, and user experience design to deliver a seamless healthcare booking experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI-Powered Matching</h3>
                    <p className="text-gray-600">Smart algorithms connect you with the right healthcare providers</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-level encryption and HIPAA-compliant data protection</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                    <p className="text-gray-600">Optimized performance for instant booking and real-time updates</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Next-Gen Platform</h3>
                  <p className="text-gray-600">Experience the future of healthcare today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied patients who have already discovered the FutureCare difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book-appointment"
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
            >
              Book Your First Appointment
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}