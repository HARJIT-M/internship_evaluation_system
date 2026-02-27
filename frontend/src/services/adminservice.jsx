import axios from "axios";

const API = "http://localhost:8000/api/admin";

const getToken = () => localStorage.getItem("token");

export const getInterns = async () => {
  const res = await axios.get(`${API}/interns`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const getTeamleads = async () => {
  const res = await axios.get(`${API}/teamleads`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const addUser = async (data) => {
  const res = await axios.post(`${API}/add-user`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API}/delete-user/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};
