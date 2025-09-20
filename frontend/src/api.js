
import axios from "axios";

const API = axios.create({
  baseURL: "https://schoolmanagement-backend-l9l9.onrender.com", 
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

