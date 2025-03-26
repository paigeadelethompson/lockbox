import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  masterPassword: string;
  setMasterPassword: (password: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [masterPassword, setMasterPassword] = useState<string>('');

  const value = {
    masterPassword,
    setMasterPassword,
    isAuthenticated: !!masterPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 