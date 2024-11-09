import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://full-stack-ecommerce-backend-jk6z.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
