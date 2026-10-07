import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { StorageService } from '../lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSeller: boolean;
  loading: boolean;
  loginWithEmail: (email: string, role?: UserRole) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile | null>;
  loginAsDemo: (type: 'superadmin' | 'seller' | 'buyer') => Promise<UserProfile>;
  register: (name: string, email: string, phone: string, role: UserRole) => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'satyadeal_current_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    StorageService.initializeDefaults();

    // Check cached current user session
    const cached = localStorage.getItem(CURRENT_USER_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        // ignore
      }
    } else {
      // Default to demo seller/buyer Rohit for convenient instant exploration
      const users = StorageService.getUsers();
      const defaultUser = users.find(u => u.email === 'rohit.seller@satyadeal.com') || users[0];
      if (defaultUser) {
        setUser(defaultUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const users = StorageService.getUsers();
        let profile = users.find(u => u.email.toLowerCase() === fbUser.email?.toLowerCase());
        
        const isSuperAdminEmail = fbUser.email?.toLowerCase() === 'shuvendu.dhenki@gmail.com';
        
        if (!profile) {
          profile = {
            id: fbUser.uid,
            name: fbUser.displayName || 'SatyaDeal User',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '+91 98000 00000',
            role: isSuperAdminEmail ? 'superadmin' : 'seller',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            city: 'Kolkata',
            state: 'West Bengal',
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
            isVerified: true,
          };
          await StorageService.saveUser(profile);
        } else if (isSuperAdminEmail && profile.role !== 'superadmin') {
          profile.role = 'superadmin';
          await StorageService.saveUser(profile);
        }
        
        setUser(profile);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, preferredRole: UserRole = 'seller'): Promise<UserProfile> => {
    const users = StorageService.getUsers();
    let profile = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    const isSuperAdminEmail = email.toLowerCase() === 'shuvendu.dhenki@gmail.com';

    if (!profile) {
      profile = {
        id: 'usr-' + Date.now(),
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        phone: '+91 98765 00000',
        role: isSuperAdminEmail ? 'superadmin' : preferredRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        city: 'Kolkata',
        state: 'West Bengal',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        isVerified: true,
      };
      await StorageService.saveUser(profile);
    }

    setUser(profile);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
    return profile;
  };

  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      
      const users = StorageService.getUsers();
      const isSuperAdminEmail = fbUser.email?.toLowerCase() === 'shuvendu.dhenki@gmail.com';
      
      let profile = users.find(u => u.email.toLowerCase() === fbUser.email?.toLowerCase());
      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+91 98000 00000',
          role: isSuperAdminEmail ? 'superadmin' : 'seller',
          avatar: fbUser.photoURL || undefined,
          city: 'Kolkata',
          state: 'West Bengal',
          status: 'active',
          joinedDate: new Date().toISOString().split('T')[0],
          isVerified: true,
        };
        await StorageService.saveUser(profile);
      }
      setUser(profile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      return profile;
    } catch (e) {
      console.warn('Google sign-in popup notice:', e);
      // Fallback demo login
      return loginAsDemo('seller');
    }
  };

  const loginAsDemo = async (type: 'superadmin' | 'seller' | 'buyer'): Promise<UserProfile> => {
    const users = StorageService.getUsers();
    let demoUser: UserProfile | undefined;
    
    if (type === 'superadmin') {
      demoUser = users.find(u => u.role === 'superadmin' || u.email === 'shuvendu.dhenki@gmail.com');
    } else if (type === 'seller') {
      demoUser = users.find(u => u.role === 'seller' || u.id === 'seller-rohit');
    } else {
      demoUser = users.find(u => u.role === 'buyer' || u.id === 'buyer-rahul');
    }

    if (!demoUser) {
      demoUser = users[0];
    }

    setUser(demoUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
    return demoUser;
  };

  const register = async (name: string, email: string, phone: string, role: UserRole): Promise<UserProfile> => {
    const isSuperAdminEmail = email.toLowerCase() === 'shuvendu.dhenki@gmail.com';
    const newProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      role: isSuperAdminEmail ? 'superadmin' : role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      city: 'Kolkata',
      state: 'West Bengal',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      isVerified: true,
    };

    await StorageService.saveUser(newProfile);
    setUser(newProfile);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProfile));
    return newProfile;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    await StorageService.saveUser(updated);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: UserProfile = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin' || user?.email.toLowerCase() === 'shuvendu.dhenki@gmail.com';
  const isSeller = user?.role === 'seller' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        isSeller,
        loading,
        loginWithEmail,
        loginWithGoogle,
        loginAsDemo,
        register,
        updateProfile,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
