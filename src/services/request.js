import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '', // 通常使用环境变量或写死
    timeout: 10000, // 超时时间：10s
});

// 如果有需要，可以配置更多默认设置
// instance.defaults.headers.common['Authorization'] = '...';
// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 例如：在请求头中添加 token
        // Todo: 集成 jwt
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 可以在这里统一对返回数据进行处理
        // 例如，根据后端返回的 code 判断是否成功
        // 然后把实际数据返回
        return response.data;
    },
    (error) => {
        // 可以在这里对错误进行统一处理，如全局提示
        // 例如：处理 401、403 等
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default instance;
