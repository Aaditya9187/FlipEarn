import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || 'http://localhost:5000'
    // baseURL: import.meta.env.VITE_BASEURL || 'https://flipearn-backend.vercel.app/'  
})

export default api;