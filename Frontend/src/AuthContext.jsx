// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch('https://cookverse.onrender.com/auth/user', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setUser(data?._id ? data : null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await fetch('https://cookverse.onrender.com/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
