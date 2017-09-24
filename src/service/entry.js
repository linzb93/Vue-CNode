import axios from 'axios';

var service = axios.create({
    baseURL: 'https://cnodejs.org/api/v1',
    timeout: 5000
});

//request拦截器
// service.interceptors.request.use(config => {});

//respone拦截器
// service.interceptors.response.use(
//     res => {
//     var data = res.data;
//     if (data.success !== true) {
//         this.$message({
//             message: '服务器故障'
//         })
//     }
//     },
//     error => {
//       console.log('err' + error)// for debug
//       this.$message({
//         message: error.message,
//         type: 'error',
//         duration: 5 * 1000
//       })
//       return Promise.reject(error)
//     }
//   )

export default service;