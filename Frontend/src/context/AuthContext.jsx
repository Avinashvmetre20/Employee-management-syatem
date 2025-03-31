import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, getUserProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      getUserProfile(token).then(setUser).catch(() => logout());
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data?.success) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  const signup = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    if (data?.success) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
