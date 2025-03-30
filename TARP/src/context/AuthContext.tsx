import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  user: string | null; // Add user to context, set as string for example
  logout: () => void; // Add logout function
  fetchUserDetails?: () => Promise<void>; // Optional, for fetching user details
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null); // State for user

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      setUser("User Name"); // Fetch or set user details as needed
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchUserDetails = async () => {
    try {
      // Simulate fetching user data or retrieving it from a server
      const fetchedUser = "User Name"; // Replace with actual API call if needed
      setUser(fetchedUser);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        logout,
        fetchUserDetails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
