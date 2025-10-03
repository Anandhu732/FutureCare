"use client";

import { useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  insurance: string;
  policyNumber: string;
  avatar?: string;
  verified: boolean;
  memberSince: string;
  lastLogin: string;
}

export interface UserSession {
  user: {
    email: string;
    name: string;
    id: string;
  };
  token: string;
  expires: number;
  provider?: string;
}

// Mock user profile service - in real app this would be API calls
export class UserProfileService {
  static async fetchUserProfile(userId: string): Promise<UserProfile> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data based on user ID
    return {
      id: userId,
      name: userId === "user_001" ? "Admin User" : "Google User",
      email: userId === "user_001" ? "admin@futurecare.com" : "user@gmail.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-01-01",
      address: "123 Healthcare Ave, Medical District",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      emergencyContact: "+1 (555) 987-6543",
      insurance: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      verified: true,
      memberSince: "2023-01-15",
      lastLogin: new Date().toISOString()
    };
  }

  static async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // In real app, this would update the backend and return updated profile
    const currentProfile = await this.fetchUserProfile(userId);
    const updatedProfile = { ...currentProfile, ...profileData };

    // Update localStorage session if name changed
    if (profileData.name) {
      const sessionData = localStorage.getItem("futurecare_session");
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          session.user.name = profileData.name;
          localStorage.setItem("futurecare_session", JSON.stringify(session));
        } catch (error) {
          console.error("Failed to update session:", error);
        }
      }
    }

    return updatedProfile;
  }

  static async getCurrentSession(): Promise<UserSession | null> {
    const sessionData = localStorage.getItem("futurecare_session");
    if (sessionData) {
      try {
        const session: UserSession = JSON.parse(sessionData);
        if (session.expires > Date.now()) {
          return session;
        } else {
          localStorage.removeItem("futurecare_session");
          return null;
        }
      } catch {
        localStorage.removeItem("futurecare_session");
        return null;
      }
    }
    return null;
  }
}

// Custom hook for user profile management
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentSession = await UserProfileService.getCurrentSession();
      if (currentSession) {
        setSession(currentSession);
        const userProfile = await UserProfileService.fetchUserProfile(currentSession.user.id);
        setProfile(userProfile);
      } else {
        setError("No active session found");
      }
    } catch (err) {
      setError("Failed to load user data");
      console.error("Error loading user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!session || !profile) return;

    try {
      setLoading(true);
      const updatedProfile = await UserProfileService.updateUserProfile(session.user.id, updates);
      setProfile(updatedProfile);

      // Update session if name changed
      if (updates.name) {
        setSession(prev => prev ? {
          ...prev,
          user: { ...prev.user, name: updates.name! }
        } : null);
      }

      return updatedProfile;
    } catch (err) {
      setError("Failed to update profile");
      console.error("Error updating profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    loadUserData();
  };

  return {
    profile,
    session,
    loading,
    error,
    updateProfile,
    refreshProfile
  };
}