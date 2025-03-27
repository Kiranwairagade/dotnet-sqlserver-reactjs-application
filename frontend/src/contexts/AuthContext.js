import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLogin, refreshToken as apiRefreshToken } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const data = await apiRefreshToken();
          setToken(data.token);
        } catch (error) {
          console.error("Token refresh failed:", error);
          logout();
        }
      }
    };
    checkToken();
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
