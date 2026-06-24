import { useState } from 'react';
import { Pencil, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  location: string;
}

// Mock user profile data (no backend yet)
const mockProfileData: ProfileFormData = {
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@gmail.com',
  phone: '+91 9856732431',
  gender: 'Male',
  dateOfBirth: '1995-04-12',
  location: 'Tirunelveli, Tamil Nadu',
};

function FormField({
  label,
  value,
  onChange,
  disabled,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder ?? label}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors outline-none
          ${disabled
            ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed'
            : 'bg-white border-[#c8b97a] text-gray-900 focus:ring-2 focus:ring-[#2d6a2d]/30 focus:border-[#2d6a2d]'
          }`}
      />
    </div>
  );
}

export default function MyProfile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData>({
    ...mockProfileData,
    fullName: user?.name ?? mockProfileData.fullName,
    email: user?.email ?? mockProfileData.email,
  });

  const [draft, setDraft] = useState<ProfileFormData>(formData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setDraft({ ...formData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setFormData({ ...draft });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...formData });
    setIsEditing(false);
  };

  const update = (field: keyof ProfileFormData) => (val: string) =>
    setDraft((prev) => ({ ...prev, [field]: val }));

  return (
    <div className="flex flex-col gap-4">
      {/* ── Profile Header Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#a8c57a] to-[#2d6a2d]
                          flex items-center justify-center text-white text-3xl font-bold
                          shadow-md select-none overflow-hidden"
            >
              {formData.fullName.charAt(0).toUpperCase()}
            </div>
            <button
              className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200
                         rounded-full flex items-center justify-center shadow-sm
                         hover:bg-gray-50 transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{formData.email}</p>
            <p className="text-sm text-gray-500">{formData.phone}</p>
          </div>
        </div>
      </div>

      {/* ── Personal Information Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md border border-[#c8b97a]
                         bg-[#fdf8ec] text-[#8a6a00] text-sm font-medium
                         hover:bg-[#f5efd5] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md border border-gray-300
                           bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md
                           bg-[#2d6a2d] text-white text-sm font-medium
                           hover:bg-[#1e5a1e] transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <FormField
            label="Full Name"
            value={draft.fullName}
            onChange={update('fullName')}
            disabled={!isEditing}
          />
          <FormField
            label="Email"
            value={draft.email}
            onChange={update('email')}
            disabled={!isEditing}
            type="email"
          />
          <FormField
            label="Phone"
            value={draft.phone}
            onChange={update('phone')}
            disabled={!isEditing}
            type="tel"
          />
          <FormField
            label="Gender"
            value={draft.gender}
            onChange={update('gender')}
            disabled={!isEditing}
          />
          <FormField
            label="Date of Birth"
            value={draft.dateOfBirth}
            onChange={update('dateOfBirth')}
            disabled={!isEditing}
            type="date"
          />
          <FormField
            label="Location"
            value={draft.location}
            onChange={update('location')}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}
