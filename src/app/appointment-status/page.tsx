"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface AppointmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  doctor: string;
  symptoms?: string;
  appointmentId: string;
  status: string;
  confirmationNumber: string;
}

export default function AppointmentStatus() {
  const searchParams = useSearchParams();
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get appointment data from URL parameters
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const appointmentType = searchParams.get("appointmentType");
    const preferredDate = searchParams.get("preferredDate");
    const preferredTime = searchParams.get("preferredTime");
    const doctor = searchParams.get("doctor");
    const symptoms = searchParams.get("symptoms");

    if (firstName && lastName && email) {
      // Generate a mock appointment ID and confirmation number
      const appointmentId = `APT-${Date.now().toString().slice(-6)}`;
      const confirmationNumber = `FC${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      setAppointmentData({
        firstName,
        lastName,
        email,
        phone: phone || "",
        appointmentType: appointmentType || "",
        preferredDate: preferredDate || "",
        preferredTime: preferredTime || "",
        doctor: doctor || "",
        symptoms: symptoms || "",
        appointmentId,
        status: "Confirmed",
        confirmationNumber,
      });
    }
    setLoading(false);
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Processing your appointment...</p>
        </div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find your appointment details. Please try booking again or contact support.
            </p>
            <Link
              href="/book-appointment"
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition"
            >
              Book New Appointment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Appointment Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your healthcare appointment has been successfully scheduled
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <p className="text-lg font-semibold text-gray-900">
                  {appointmentData.firstName} {appointmentData.lastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <p className="text-lg text-gray-900">{appointmentData.appointmentType}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <p className="text-lg text-gray-900">{appointmentData.doctor}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <p className="text-lg text-gray-900">
                  {formatDate(appointmentData.preferredDate)} at {appointmentData.preferredTime}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {appointmentData.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
                <p className="text-lg font-mono text-gray-900">{appointmentData.appointmentId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Number</label>
                <p className="text-lg font-mono text-gray-900">{appointmentData.confirmationNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                <p className="text-sm text-gray-900">{appointmentData.email}</p>
                <p className="text-sm text-gray-900">{appointmentData.phone}</p>
              </div>
            </div>
          </div>

          {/* Symptoms Section */}
          {appointmentData.symptoms && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms / Reason for Visit</label>
              <p className="text-gray-900 bg-white p-4 rounded-lg border">{appointmentData.symptoms}</p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Next?</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
              You will receive a confirmation email with all appointment details
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
              We&apos;ll send you a reminder 24 hours before your appointment
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
              Please arrive 15 minutes early for check-in
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
              Bring a valid ID and insurance card (if applicable)
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-900 transition text-center"
          >
            Back to Home
          </Link>
          <Link
            href="/book-appointment"
            className="border border-black text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition text-center"
          >
            Book Another Appointment
          </Link>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Need to cancel or reschedule?</p>
          <p className="font-semibold">Call us at: <span className="text-black">(555) 123-4567</span></p>
          <p className="text-sm mt-2">Or email: <span className="text-black">appointments@futurecare.com</span></p>
        </div>
      </div>
    </div>
  );
}