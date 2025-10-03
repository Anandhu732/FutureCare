"use client";

import { useState } from "react";
import { useUserProfile, UserProfile as UserProfileType } from "./UserProfileService";

export default function UserProfile() {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfileType>>({});
  const [successMessage, setSuccessMessage] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">
          {error || "Failed to load profile"}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
    setSuccessMessage("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile(editedProfile);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
    setSuccessMessage("");
  };

  const handleInputChange = (field: keyof UserProfileType, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h2>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Quick Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center justify-center mt-2">
                <div className={`w-2 h-2 rounded-full mr-2 ${profile.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className={`text-sm ${profile.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {profile.verified ? 'Verified Account' : 'Unverified'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div>
                <p className="text-gray-500 text-sm">Member Since</p>
                <p className="text-gray-900 font-medium">{new Date(profile.memberSince).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Last Login</p>
                <p className="text-gray-900 font-medium">{new Date(profile.lastLogin).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProfile.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.city}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.state}</p>
                )}
              </div>

              {/* ZIP Code */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">ZIP Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.zipCode || ''}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.zipCode}</p>
                )}
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.emergencyContact || ''}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2 font-medium">{profile.emergencyContact}</p>
                )}
              </div>
            </div>

            {/* Insurance Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Insurance Provider</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.insurance || ''}
                      onChange={(e) => handleInputChange('insurance', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 font-medium">{profile.insurance}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Policy Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.policyNumber || ''}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 font-medium">{profile.policyNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}