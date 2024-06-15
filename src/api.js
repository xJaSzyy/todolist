import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/todo',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true 
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API call error: ', error.response || error.message);
        return Promise.reject(error);
    }
);

export const getAll = () => api.get('/');
export const getById = (id) => api.get(`/${id}`);
export const createTodo = (todo) => api.post('/', todo);
export const updateTodo = (id, todo) => api.put(`/${id}`, todo);
export const deleteTodo = (id) => api.delete(`/${id}`);
