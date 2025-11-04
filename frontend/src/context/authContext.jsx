import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider rendered");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      const userData = response.data.data.user;
      setUser(userData);
      // Store user_id in localStorage for backward compatibility
      if (userData?.id) {
        localStorage.setItem("user_id", userData.id);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/update`, userData);
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      console.error("Failed to update user", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
