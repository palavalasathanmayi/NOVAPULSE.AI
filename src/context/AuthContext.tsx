import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppUser } from '../types';

interface AuthContextType {
  currentUser: AppUser | null;
  allDatabaseUsers: AppUser[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDatabaseUsersModalOpen: boolean;
  setIsDatabaseUsersModalOpen: (open: boolean) => void;
  isLoading: boolean;
  loginWithGoogle: (credential?: string, customProfile?: Partial<AppUser>) => Promise<boolean>;
  loginManual: (email: string, name?: string, role?: AppUser['role']) => Promise<boolean>;
  logout: () => void;
  refreshDatabaseUsers: () => Promise<void>;
  deleteDatabaseUser: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('novapulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [allDatabaseUsers, setAllDatabaseUsers] = useState<AppUser[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDatabaseUsersModalOpen, setIsDatabaseUsersModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all persisted users from the database
  const refreshDatabaseUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          setAllDatabaseUsers(data.users);
          // If current user is logged in, sync fresh info from database
          if (currentUser) {
            const fresh = data.users.find((u: AppUser) => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase());
            if (fresh) {
              setCurrentUser(fresh);
              localStorage.setItem('novapulse_user', JSON.stringify(fresh));
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch users from database:', err);
    }
  };

  useEffect(() => {
    refreshDatabaseUsers();
  }, []);

  // Login with Google and remember in database
  const loginWithGoogle = async (credential?: string, customProfile?: Partial<AppUser>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, profile: customProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('novapulse_user', JSON.stringify(data.user));
          await refreshDatabaseUsers();
          setIsAuthModalOpen(false);
          return true;
        }
      }
    } catch (err) {
      console.error('Error logging in with Google:', err);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Direct manual sign in / account registration
  const loginManual = async (email: string, name?: string, role?: AppUser['role']): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('novapulse_user', JSON.stringify(data.user));
          await refreshDatabaseUsers();
          setIsAuthModalOpen(false);
          return true;
        }
      }
    } catch (err) {
      console.error('Error logging in:', err);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('novapulse_user');
  };

  const deleteDatabaseUser = async (userId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/auth/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        if (currentUser && currentUser.id === userId) {
          logout();
        }
        await refreshDatabaseUsers();
        return true;
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allDatabaseUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDatabaseUsersModalOpen,
        setIsDatabaseUsersModalOpen,
        isLoading,
        loginWithGoogle,
        loginManual,
        logout,
        refreshDatabaseUsers,
        deleteDatabaseUser,
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
