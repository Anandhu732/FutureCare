"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Appointment, HealthDataService, formatDate, getStatusColor, getPriorityColor } from "../services/healthDataService";
import { useDeviceCapabilities, MobileButton, MobileCard, MobileTabs } from "../utils/mobileUtils";

interface AppointmentFilters {
  status: string;
  doctor: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  priority: string;
}

interface SortConfig {
  key: keyof Appointment;
  direction: 'asc' | 'desc';
}

interface AdvancedAppointmentsProps {
  userId: string;
}

export default function AdvancedAppointments({ userId }: AdvancedAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const { isSmallScreen, isTouchDevice } = useDeviceCapabilities();

  const [filters, setFilters] = useState<AppointmentFilters>({
    status: '',
    doctor: '',
    dateFrom: '',
    dateTo: '',
    search: '',
    priority: ''
  });

  // Load appointments
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HealthDataService.getAppointments(userId, filters);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Filter appointments by tab
  const tabFilteredAppointments = useMemo(() => {
    const now = new Date();
    if (selectedTab === 'upcoming') {
      return appointments.filter(apt => new Date(apt.date) >= now && apt.status !== 'cancelled');
    } else if (selectedTab === 'past') {
      return appointments.filter(apt => new Date(apt.date) < now || apt.status === 'completed');
    } else if (selectedTab === 'cancelled') {
      return appointments.filter(apt => apt.status === 'cancelled');
    }
    return appointments;
  }, [appointments, selectedTab]);

  // Apply sorting
  const sortedAppointments = useMemo(() => {
    return [...tabFilteredAppointments].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tabFilteredAppointments, sortConfig]);

  // Pagination
  const totalAppointments = sortedAppointments.length;
  const totalPages = Math.ceil(totalAppointments / itemsPerPage);
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    const now = new Date();
    return {
      all: appointments.length,
      upcoming: appointments.filter(apt => new Date(apt.date) >= now && apt.status !== 'cancelled').length,
      past: appointments.filter(apt => new Date(apt.date) < now || apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    };
  }, [appointments]);

  const handleFilterChange = (key: keyof AppointmentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      doctor: '',
      dateFrom: '',
      dateTo: '',
      search: '',
      priority: ''
    });
    setCurrentPage(1);
  };

  if (error) {
    return (
      <MobileCard className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">Error Loading Appointments</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <MobileButton onClick={loadAppointments} variant="primary">
          Try Again
        </MobileButton>
      </MobileCard>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <MobileCard key={i}>
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </MobileCard>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile-Enhanced Header */}
      <MobileCard className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">My Appointments</h2>
            <p className="text-gray-300 text-sm">Manage and track all your healthcare appointments</p>
          </div>
          <div className="flex-shrink-0">
            <MobileButton
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              size={isSmallScreen ? "md" : "sm"}
              className="bg-white text-black hover:bg-gray-100"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filters
            </MobileButton>
          </div>
        </div>
      </MobileCard>

      {/* Mobile-Enhanced Search */}
      <MobileCard>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search appointments by doctor, specialty, or symptoms..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${isTouchDevice ? 'min-h-[44px]' : ''}`}
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className={`grid gap-4 ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${isTouchDevice ? 'min-h-[44px]' : ''}`}
                >
                  <option value="">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <input
                  type="text"
                  placeholder="Doctor name"
                  value={filters.doctor}
                  onChange={(e) => handleFilterChange('doctor', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${isTouchDevice ? 'min-h-[44px]' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${isTouchDevice ? 'min-h-[44px]' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${isTouchDevice ? 'min-h-[44px]' : ''}`}
                >
                  <option value="">All Priorities</option>
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <MobileButton
                onClick={clearFilters}
                variant="secondary"
                size="sm"
                fullWidth={isSmallScreen}
              >
                Clear Filters
              </MobileButton>
            </div>
          </div>
        )}
      </MobileCard>

      {/* Mobile-Enhanced Status Tabs */}
      <MobileCard padding="sm">
        <MobileTabs
          tabs={[
            { id: 'all', label: `All (${statusCounts.all})`, icon: '📋' },
            { id: 'upcoming', label: `Upcoming (${statusCounts.upcoming})`, icon: '📅' },
            { id: 'past', label: `Past (${statusCounts.past})`, icon: '✅' },
            { id: 'cancelled', label: `Cancelled (${statusCounts.cancelled})`, icon: '❌' }
          ]}
          activeTab={selectedTab}
          onChange={(tabId) => {
            setSelectedTab(tabId);
            setCurrentPage(1);
          }}
        />
      </MobileCard>

      {/* Results Info and Sort */}
      <MobileCard padding="sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {paginatedAppointments.length} of {totalAppointments} appointments
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
              <select
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-');
                  setSortConfig({ key: key as keyof Appointment, direction: direction as 'asc' | 'desc' });
                }}
                className={`px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-black ${isTouchDevice ? 'min-h-[36px]' : ''}`}
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="doctor-asc">Doctor (A-Z)</option>
                <option value="doctor-desc">Doctor (Z-A)</option>
                <option value="status-asc">Status</option>
                <option value="priority-desc">Priority</option>
              </select>
            </div>
            {!isSmallScreen && (
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </MobileCard>

      {/* Mobile-Optimized Appointments List */}
      <div className="space-y-3">
        {paginatedAppointments.length === 0 ? (
          <MobileCard className="text-center py-8">
            <div className="text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 5a4 4 0 110 8m-6-3a4 4 0 118 0m0-10a4 4 0 110 8" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">
                {selectedTab === 'all' ? 'You have no appointments scheduled.' :
                 selectedTab === 'upcoming' ? 'You have no upcoming appointments.' :
                 selectedTab === 'past' ? 'You have no past appointments.' :
                 'You have no cancelled appointments.'}
              </p>
            </div>
          </MobileCard>
        ) : (
          paginatedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isMobile={isSmallScreen}
              isTouchDevice={isTouchDevice}
            />
          ))
        )}
      </div>

      {/* Mobile-Enhanced Pagination */}
      {totalPages > 1 && (
        <MobileCard padding="sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <MobileButton
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="secondary"
                size="sm"
              >
                Previous
              </MobileButton>
              <MobileButton
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="secondary"
                size="sm"
              >
                Next
              </MobileButton>
            </div>
          </div>
        </MobileCard>
      )}
    </div>
  );
}

// Mobile-Optimized Appointment Card Component
interface AppointmentCardProps {
  appointment: Appointment;
  isMobile: boolean;
  isTouchDevice: boolean;
}

function AppointmentCard({ appointment, isMobile, isTouchDevice }: AppointmentCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <MobileCard className="hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{appointment.doctor}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
              <span className="flex items-center">
                📅 {formatDate(appointment.date)}
              </span>
              <span className="flex items-center">
                🕐 {appointment.time}
              </span>
              {appointment.location && (
                <span className="flex items-center">
                  📍 {appointment.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
              {appointment.priority}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 ${isTouchDevice ? 'min-w-[44px] min-h-[44px]' : ''}`}
            >
              <svg className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="pt-3 border-t border-gray-200 space-y-3">
            {appointment.symptoms && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Symptoms/Reason:</p>
                <p className="text-sm text-gray-600">{appointment.symptoms}</p>
              </div>
            )}

            {appointment.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                <p className="text-sm text-gray-600">{appointment.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
              {(appointment.status === "pending" || appointment.status === "confirmed") && (
                <>
                  <MobileButton
                    onClick={() => {/* Handle reschedule */}}
                    variant="secondary"
                    size="sm"
                    fullWidth={isMobile}
                  >
                    Reschedule
                  </MobileButton>
                  <MobileButton
                    onClick={() => {/* Handle cancel */}}
                    variant="danger"
                    size="sm"
                    fullWidth={isMobile}
                  >
                    Cancel
                  </MobileButton>
                </>
              )}
              {appointment.status === "completed" && (
                <>
                  <MobileButton
                    onClick={() => {/* Handle view summary */}}
                    variant="primary"
                    size="sm"
                    fullWidth={isMobile}
                  >
                    View Summary
                  </MobileButton>
                  <MobileButton
                    onClick={() => {/* Handle book follow-up */}}
                    variant="secondary"
                    size="sm"
                    fullWidth={isMobile}
                  >
                    Book Follow-up
                  </MobileButton>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileCard>
  );
}