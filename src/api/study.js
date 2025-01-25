import request from '@/services/request.js';

export function list() {
    return request.post('/api/study/list')
}

export function queryByName(name) {
    return request.post('/api/study/queryByName', null, {params: {name}})
}

export function insertStudy(data) {
    return request.post('/api/study/insert', data)
}

export function updateStudy(data) {
    return request.post('/api/study/update', data)
}

export function deleteStudy(data) {
    return request.post('/api/study/delete', data)
}
