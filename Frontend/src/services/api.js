import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.user;
};

export const getEmployees = async (token) => {
  const response = await axios.get(`${API_URL}/employees`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
