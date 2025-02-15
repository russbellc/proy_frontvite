import axios from 'axios';

const apiServer = import.meta.env.VITE_API_SERVER;

const axiosClient = axios.create({
    baseURL: apiServer,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axiosClient;
