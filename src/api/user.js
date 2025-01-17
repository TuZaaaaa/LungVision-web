import request from '@/services/request.js';

export function login(data) {
    return request.post('/api/user/login',  {username: data.username, password: data.password} );
}
