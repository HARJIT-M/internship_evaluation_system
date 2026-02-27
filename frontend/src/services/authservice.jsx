// src/services/authService.js
import axios from "axios";

const API = "http://localhost:8000/api/auth";

export const login = async (data) => {
  const res = await axios.post(`${API}/login`, data);

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", res.data.user.role);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data.user.role;
};

export const logout = () => {
  localStorage.clear();
};

export const getToken = () => {
  return localStorage.getItem("token");
};
