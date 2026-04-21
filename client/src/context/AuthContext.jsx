import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const register = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await result.user.updateProfile({ displayName });
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const getIdToken = async () => {
    return user?.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};