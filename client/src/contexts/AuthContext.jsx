import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

const safeParse = (data) => {
  try {
    return data && data !== "undefined" ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parsedUser = safeParse(localStorage.getItem("user"));

    if (token && parsedUser) {
      setUser(parsedUser);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // Avatar จะโชว์ทันที
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // เพิ่ม isAuthenticated สำหรับเช็คการล็อกอิน
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  const { user, login, logout, loading } = context;
  return { user, login, logout, loading, isAuthenticated: !!user };
};