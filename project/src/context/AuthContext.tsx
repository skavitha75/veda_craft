import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  addressType: 'Home' | 'Work';
}

export interface SelectedLocation {
  type: 'pincode' | 'address';
  value: string; // pincode or address ID
  text: string;  // e.g. "Tirunelveli - 627002" or "627002"
}

interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  gender?: string;
  dob?: string;
  is_profile_complete: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  selectedLocation: SelectedLocation;
  updateLocation: (location: SelectedLocation) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default address list for a newly logged in mock user if none exists
const defaultAddresses: Address[] = [
  {
    id: 'addr-default-1',
    fullName: 'Kavitha',
    phoneNumber: '9876543210',
    address: '364, Palace Street, South Bazar',
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    pincode: '627002',
    landmark: 'Near Temple',
    addressType: 'Home'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const fetchProfile = async (sessionUser: any) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();
        
      if (data) {
        const fullUser: User = {
          id: sessionUser.id,
          name: data.full_name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
          email: sessionUser.email || '',
          phone_number: data.phone_number || '',
          gender: data.gender || '',
          dob: data.dob || '',
          is_profile_complete: data.is_profile_complete || false,
        };
        setUser(fullUser);
        localStorage.setItem('vc_user', JSON.stringify(fullUser));
      } else {
        // Fallback if profile doesn't exist yet (e.g. trigger hasn't fired or failed)
        const partialUser: User = {
          id: sessionUser.id,
          name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
          email: sessionUser.email || '',
          is_profile_complete: false,
        };
        setUser(partialUser);
        localStorage.setItem('vc_user', JSON.stringify(partialUser));
      }
      
      const savedAddrs = localStorage.getItem('deliveryAddresses');
      if (!savedAddrs || JSON.parse(savedAddrs).length === 0) {
        setAddresses(defaultAddresses);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Listen to Supabase auth state changes
  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      }
    });

    // Listen for auth events (e.g. successful login)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        localStorage.removeItem('vc_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('deliveryAddresses');
    if (saved) {
      return JSON.parse(saved);
    }
    // Return empty list initially
    return [];
  });

  // Selected Location state
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(() => {
    const saved = localStorage.getItem('vc_selected_location');
    if (saved) return JSON.parse(saved);
    
    // Default fallback
    return {
      type: 'pincode',
      value: '627002',
      text: 'Tirunelveli - 627002'
    };
  });

  // Sync addresses to localStorage
  useEffect(() => {
    localStorage.setItem('deliveryAddresses', JSON.stringify(addresses));
  }, [addresses]);

  // Keep login for mock functionality, but recommend using Supabase auth directly
  const login = (email: string, name?: string) => {
    const defaultName = name || email.split('@')[0];
    const newUser: User = { 
      id: `mock-${Date.now()}`,
      name: defaultName, 
      email, 
      is_profile_complete: false 
    };
    setUser(newUser);
    localStorage.setItem('vc_user', JSON.stringify(newUser));

    // If user logs in and has no addresses, set default mock addresses
    const savedAddrs = localStorage.getItem('deliveryAddresses');
    if (!savedAddrs || JSON.parse(savedAddrs).length === 0) {
      setAddresses(defaultAddresses);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('vc_user');
    setAddresses([]);
    localStorage.removeItem('deliveryAddresses');
  };

  const addAddress = (newAddr: Omit<Address, 'id'>): Address => {
    const created: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setAddresses(prev => [...prev, created]);
    return created;
  };

  const updateAddress = (updated: Address) => {
    setAddresses(prev => prev.map(a => a.id === updated.id ? updated : a));
    // If the active location was this address, update the text
    if (selectedLocation.type === 'address' && selectedLocation.value === updated.id) {
      setSelectedLocation({
        type: 'address',
        value: updated.id,
        text: `${updated.city} - ${updated.pincode}`
      });
      localStorage.setItem('vc_selected_location', JSON.stringify({
        type: 'address',
        value: updated.id,
        text: `${updated.city} - ${updated.pincode}`
      }));
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    // If deleted address was active, fallback to first available address or pincode
    if (selectedLocation.type === 'address' && selectedLocation.value === id) {
      const remaining = addresses.filter(a => a.id !== id);
      if (remaining.length > 0) {
        updateLocation({
          type: 'address',
          value: remaining[0].id,
          text: `${remaining[0].city} - ${remaining[0].pincode}`
        });
      } else {
        updateLocation({
          type: 'pincode',
          value: '627002',
          text: 'Tirunelveli - 627002'
        });
      }
    }
  };

  const updateLocation = (loc: SelectedLocation) => {
    setSelectedLocation(loc);
    localStorage.setItem('vc_selected_location', JSON.stringify(loc));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      selectedLocation,
      updateLocation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
