import request from '@/services/request.js';

export function list() {
    return request.post('/api/task/list')
}
