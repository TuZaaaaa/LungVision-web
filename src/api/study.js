import request from '@/services/request.js';
import axios from 'axios';

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

export function imageProcessWithStudyId(data) {
    return request.post('/py-api/image_process', data)
}
const getTaskStatus = (taskId) => {
    return axios.get(`/py-api/task_status/${taskId}`);
  };export { getTaskStatus };

export function reportGenerateWithStudyId(data) {
    return request.post('/py-api/report_generate', data)
}
