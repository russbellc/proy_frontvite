import axios from 'axios';

const apiServer = "https://backend-crox.up.railway.app/api/";
// const apiServer = import.meta.env.VITE_API_SERVER;

const axiosClient = axios.create({
    baseURL: apiServer,
    headers: {
        // Eliminar 'Content-Type' para permitir que axios lo maneje automáticamente
    },
    withCredentials: true,
});

export default axiosClient;
