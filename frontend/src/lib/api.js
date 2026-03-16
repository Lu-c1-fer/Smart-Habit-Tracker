//javascript library to make HTTP requests to backend API
import axios from "axios";

//create axios instance so that you dont have to repeat your backen URL everywhere
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

//this will run before every request
// it gets jwt token from local storage and adds it to the request header
api.interceptors.request.use(config=>{
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

//this runs after every response

api.interceptors.response.use(
    res => res,
    err=> {
        console.log('API ERROR:', err.response?.status, err.response?.data, err.config?.url);
        if(err.response?.status === 401){
            localStorage.removeItem('token');//if the token is invalid or expired it deletes token 
            window.location.href= '/login'; //and loggs out user automatically
        }
        return Promise.reject(err);
    }
)

export default api;
