import request from '@/services/request.js';

export function login(data) {
    return request.post('/auth/login', data);
}

export function getUserProfile() {
    return request.get('/user/profile');
}