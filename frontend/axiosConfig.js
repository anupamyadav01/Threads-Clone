import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Dynamic API URL based on environment
  withCredentials: true,
});

export default axiosInstance;
