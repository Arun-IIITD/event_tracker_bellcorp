import axios from "axios";
//https://event-tracker-bellcorp.onrender.com/
const instance = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "https://event-tracker-bellcorp.onrender.com/api",
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;
