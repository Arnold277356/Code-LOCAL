import axios from 'axios';
const API = axios.create({
  baseURL: 'https://burol-1-web-backend.onrender.com/api'
});

export default API;