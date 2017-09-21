import Vue from 'vue';
import Router from 'vue-router';
import CoHeader from '@/components/header';
import Login from '@/views/login/Login';
import Index from '@/views/index/Index';
import Detail from '@/views/detail/Detail';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            components: {
                header: CoHeader,
                main: Index
            },
        },
        {
            path: '/login',
            components: {
                main: Login
            }
        },
        {
            path: '/detail/:id',
            components: {
                header: CoHeader,
                main: Detail
            }
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});
