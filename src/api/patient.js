import request from '@/services/request.js';

export function list() {
    return request.post('/api/patient/list')
}

export function queryByName(name) {
    return request.post('/api/patient/queryByName', null, {params: {name}})
}

export function insertPatient(data) {
    return request.post('/api/patient/insert', data)
}

export function updatePatient(data) {
    return request.post('/api/patient/update', data)
}

export function deletePatient(data) {
    return request.post('/api/patient/delete', data)
}
