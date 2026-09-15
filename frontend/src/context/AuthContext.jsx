import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const getStored = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const persist = (data, rememberMe) => {
  const store = rememberMe ? localStorage : sessionStorage;
  store.setItem("token", data.token);
  store.setItem("email", data.email);
  if (data.name) store.setItem("name", data.name);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStored("token"));
  const [email, setEmail] = useState(getStored("email"));
  const [name, setName] = useState(getStored("name"));

  const login = async (email, password, rememberMe = false) => {
    const res = await api.post("/auth/login", { email, password });
    persist(res.data, rememberMe);
    setToken(res.data.token);
    setEmail(res.data.email);
    setName(res.data.name);
  };

  const register = async (nameInput, email, password, rememberMe = true) => {
    const res = await api.post("/auth/register", { name: nameInput, email, password });
    persist(res.data, rememberMe);
    setToken(res.data.token);
    setEmail(res.data.email);
    setName(res.data.name);
  };

  const loginWithGoogle = async (credential, rememberMe = true) => {
    const res = await api.post("/auth/google", { credential });
    persist(res.data, rememberMe);
    setToken(res.data.token);
    setEmail(res.data.email);
    setName(res.data.name);
  };

  const changePassword = async (currentPassword, newPassword) => {
    await api.patch("/auth/change-password", { currentPassword, newPassword });
  };

  const logout = () => {
    ["token", "email", "name"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    setToken(null);
    setEmail(null);
    setName(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, email, name, login, register, loginWithGoogle, changePassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);