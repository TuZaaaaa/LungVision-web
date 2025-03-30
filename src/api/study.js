import request from '@/services/request.js';

export function list() {
    return request.post('/api/study/list')
}

export function queryByPatientId(patientId) {
    return request.post('/api/study/queryByPatientId', null, {params: {patientId}})
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

export function imageProcessWithStudyId(data) {
    return request.post('/py-api/image_process', data)
}

export function getTaskStatus(taskId) {
    return request.get(`/py-api/task_status/${taskId}`)
}

export function reportGenerateWithStudyId(data) {
    return request.post('/py-api/report_generate', data)
}

export function dataClear(data) {
    return request.post('/py-api/data_clear', data)
}
