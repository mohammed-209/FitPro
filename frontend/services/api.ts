import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // We'll change this to real API URL later

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}; 