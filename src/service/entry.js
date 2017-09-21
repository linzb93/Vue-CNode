import axios from 'axios';
import { Message } from 'element-ui';

var service = axios.create({
    baseURL: 'https://cnodejs.org/api/v1',
    timeout: 5000
});

//request拦截器
// service.interceptors.request.use(config => {});

//respone拦截器
// service.interceptors.respone.use(res => {
//     if (res.success !== true) {
//         Message({});
//     }
// });

export default service;