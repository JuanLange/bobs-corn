import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default api;
