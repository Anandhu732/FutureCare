// Mock API services for FutureCare Dashboard
// In a real application, these would be replaced with actual API calls

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location: string;
  avatar: string;
  patientId: string;
  notes?: string;
  symptoms?: string;
  priority: 'normal' | 'urgent' | 'emergency';
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: 'lab-result' | 'imaging' | 'prescription' | 'diagnosis' | 'vaccination';
  date: string;
  doctor: string;
  hospital: string;
  results?: string;
  fileUrl?: string;
  isNormal?: boolean;
  patientId: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  doctor: string;
  status: 'active' | 'completed' | 'discontinued';
  instructions: string;
  refillsRemaining: number;
  patientId: string;
}

export interface HealthMetric {
  id: string;
  type: 'blood-pressure' | 'heart-rate' | 'weight' | 'temperature' | 'glucose';
  value: number;
  unit: string;
  date: string;
  notes?: string;
  isNormal: boolean;
  patientId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'medication' | 'test-result' | 'system' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  patientId: string;
}

// Mock data generators
const generateMockAppointments = (userId: string): Appointment[] => [
  {
    id: "APT-001",
    doctor: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    date: "2025-10-15",
    time: "10:00 AM",
    type: "Annual Check-up",
    status: "confirmed",
    location: "Medical Center - Room 201",
    avatar: "SJ",
    patientId: userId,
    symptoms: "Routine physical examination",
    priority: "normal",
    createdAt: "2025-10-01T09:00:00Z",
    updatedAt: "2025-10-02T14:30:00Z"
  },
  {
    id: "APT-002",
    doctor: "Dr. Michael Chen",
    specialty: "Cardiology",
    date: "2025-10-22",
    time: "2:30 PM",
    type: "Follow-up",
    status: "pending",
    location: "Cardiology Wing - Room 305",
    avatar: "MC",
    patientId: userId,
    symptoms: "Chest pain monitoring, ECG review",
    priority: "urgent",
    createdAt: "2025-10-03T11:15:00Z",
    updatedAt: "2025-10-03T11:15:00Z"
  },
  {
    id: "APT-003",
    doctor: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    date: "2025-09-28",
    time: "11:00 AM",
    type: "Consultation",
    status: "completed",
    location: "Dermatology Clinic",
    avatar: "ER",
    patientId: userId,
    symptoms: "Skin examination, mole check",
    priority: "normal",
    createdAt: "2025-09-20T13:00:00Z",
    updatedAt: "2025-09-28T11:45:00Z"
  },
  {
    id: "APT-004",
    doctor: "Dr. David Kim",
    specialty: "Orthopedics",
    date: "2025-09-15",
    time: "3:00 PM",
    type: "X-Ray Follow-up",
    status: "completed",
    location: "Orthopedic Center",
    avatar: "DK",
    patientId: userId,
    symptoms: "Knee pain assessment",
    priority: "normal",
    createdAt: "2025-09-10T10:30:00Z",
    updatedAt: "2025-09-15T15:30:00Z"
  }
];

const generateMockMedicalRecords = (userId: string): MedicalRecord[] => [
  {
    id: "MR-001",
    title: "Blood Work - Complete Panel",
    type: "lab-result",
    date: "2025-09-30",
    doctor: "Dr. Sarah Johnson",
    hospital: "FutureCare Medical Center",
    results: "All values within normal ranges. Cholesterol slightly elevated.",
    isNormal: true,
    patientId: userId
  },
  {
    id: "MR-002",
    title: "Chest X-Ray",
    type: "imaging",
    date: "2025-09-25",
    doctor: "Dr. Michael Chen",
    hospital: "FutureCare Medical Center",
    results: "Clear lungs, normal heart size",
    isNormal: true,
    patientId: userId
  },
  {
    id: "MR-003",
    title: "Hypertension Management",
    type: "diagnosis",
    date: "2025-08-15",
    doctor: "Dr. Sarah Johnson",
    hospital: "FutureCare Medical Center",
    results: "Stage 1 hypertension, lifestyle modifications recommended",
    isNormal: false,
    patientId: userId
  }
];

const generateMockPrescriptions = (userId: string): Prescription[] => [
  {
    id: "RX-001",
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2025-08-15",
    endDate: "2026-08-15",
    doctor: "Dr. Sarah Johnson",
    status: "active",
    instructions: "Take with or without food. Monitor blood pressure regularly.",
    refillsRemaining: 5,
    patientId: userId
  },
  {
    id: "RX-002",
    medication: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    startDate: "2025-09-01",
    endDate: "2026-09-01",
    doctor: "Dr. Sarah Johnson",
    status: "active",
    instructions: "Take at bedtime. Avoid grapefruit juice.",
    refillsRemaining: 11,
    patientId: userId
  },
  {
    id: "RX-003",
    medication: "Ibuprofen",
    dosage: "400mg",
    frequency: "As needed",
    startDate: "2025-09-15",
    endDate: "2025-10-15",
    doctor: "Dr. David Kim",
    status: "completed",
    instructions: "Take with food. Maximum 3 times daily.",
    refillsRemaining: 0,
    patientId: userId
  }
];

const generateMockHealthMetrics = (userId: string): HealthMetric[] => [
  {
    id: "HM-001",
    type: "blood-pressure",
    value: 128,
    unit: "mmHg (systolic)",
    date: "2025-10-01",
    isNormal: false,
    patientId: userId,
    notes: "Slightly elevated, continue monitoring"
  },
  {
    id: "HM-002",
    type: "heart-rate",
    value: 72,
    unit: "bpm",
    date: "2025-10-01",
    isNormal: true,
    patientId: userId
  },
  {
    id: "HM-003",
    type: "weight",
    value: 175,
    unit: "lbs",
    date: "2025-10-01",
    isNormal: true,
    patientId: userId
  }
];

const generateMockNotifications = (userId: string): Notification[] => [
  {
    id: "NOT-001",
    title: "Upcoming Appointment",
    message: "Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM",
    type: "appointment",
    priority: "high",
    read: false,
    createdAt: "2025-10-14T09:00:00Z",
    actionUrl: "/dashboard?tab=appointments",
    patientId: userId
  },
  {
    id: "NOT-002",
    title: "Prescription Refill Due",
    message: "Lisinopril prescription needs refill in 7 days",
    type: "medication",
    priority: "medium",
    read: false,
    createdAt: "2025-10-08T10:00:00Z",
    actionUrl: "/dashboard?tab=prescriptions",
    patientId: userId
  },
  {
    id: "NOT-003",
    title: "Test Results Available",
    message: "Your blood work results are now available",
    type: "test-result",
    priority: "high",
    read: true,
    createdAt: "2025-10-01T14:30:00Z",
    actionUrl: "/dashboard?tab=medical-records",
    patientId: userId
  }
];

// API service functions with loading states and error handling
export class HealthDataService {
  private static async simulateApiDelay(): Promise<void> {
    const delay = Math.random() * 1000 + 500; // 500-1500ms delay
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  static async getAppointments(userId: string, filters?: {
    status?: string;
    doctor?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Appointment[]> {
    await this.simulateApiDelay();

    let appointments = generateMockAppointments(userId);

    if (filters) {
      if (filters.status) {
        appointments = appointments.filter(apt => apt.status === filters.status);
      }
      if (filters.doctor) {
        appointments = appointments.filter(apt =>
          apt.doctor.toLowerCase().includes(filters.doctor!.toLowerCase())
        );
      }
      if (filters.dateFrom) {
        appointments = appointments.filter(apt => apt.date >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        appointments = appointments.filter(apt => apt.date <= filters.dateTo!);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        appointments = appointments.filter(apt =>
          apt.doctor.toLowerCase().includes(searchLower) ||
          apt.specialty.toLowerCase().includes(searchLower) ||
          apt.type.toLowerCase().includes(searchLower) ||
          apt.symptoms?.toLowerCase().includes(searchLower)
        );
      }
    }

    return appointments;
  }

  static async getMedicalRecords(userId: string): Promise<MedicalRecord[]> {
    await this.simulateApiDelay();
    return generateMockMedicalRecords(userId);
  }

  static async getPrescriptions(userId: string): Promise<Prescription[]> {
    await this.simulateApiDelay();
    return generateMockPrescriptions(userId);
  }

  static async getHealthMetrics(userId: string, type?: string): Promise<HealthMetric[]> {
    await this.simulateApiDelay();
    let metrics = generateMockHealthMetrics(userId);

    if (type) {
      metrics = metrics.filter(metric => metric.type === type);
    }

    return metrics;
  }

  static async getNotifications(userId: string): Promise<Notification[]> {
    await this.simulateApiDelay();
    return generateMockNotifications(userId);
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.simulateApiDelay();
    // In real implementation, this would make an API call
    console.log(`Marking notification ${notificationId} as read`);
  }

  static async getHealthSummary(userId: string): Promise<{
    upcomingAppointments: number;
    activePrescriptions: number;
    recentRecords: number;
    healthScore: number;
    unreadNotifications: number;
  }> {
    await this.simulateApiDelay();

    const [appointments, prescriptions, records, notifications] = await Promise.all([
      this.getAppointments(userId),
      this.getPrescriptions(userId),
      this.getMedicalRecords(userId),
      this.getNotifications(userId)
    ]);

    return {
      upcomingAppointments: appointments.filter(apt =>
        apt.status === 'confirmed' || apt.status === 'pending'
      ).length,
      activePrescriptions: prescriptions.filter(rx => rx.status === 'active').length,
      recentRecords: records.filter(record => {
        const recordDate = new Date(record.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return recordDate >= thirtyDaysAgo;
      }).length,
      healthScore: 85, // Mock health score calculation
      unreadNotifications: notifications.filter(notif => !notif.read).length
    };
  }
}

// Utility functions for data processing
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (timeString: string): string => {
  return timeString; // Already formatted in mock data
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "discontinued":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800";
    case "emergency":
      return "bg-red-200 text-red-900";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
    case "normal":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case "appointment":
      return "📅";
    case "medication":
      return "💊";
    case "test-result":
      return "🧪";
    case "system":
      return "⚙️";
    case "reminder":
      return "🔔";
    default:
      return "ℹ️";
  }
};