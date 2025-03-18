import request from '@/services/request.js';

export function getPanelGroup() {
    return request.post('/api/dashboard/panelGroup')
}

export function getPatientAgeChart() {
    return request.post('/api/dashboard/patientAgeChart')
}

export function getImageProcessingChart() {
    return request.post('/api/dashboard/imageProcessingChart')
}
