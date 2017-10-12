import Vue from 'vue';
import Router from 'vue-router';
import CoHeader from '@/views/layout/Header';
import Login from '@/views/login/Login';
import Index from '@/views/index/Index';
import Detail from '@/views/detail/Detail';
import Update from '@/views/detail/Update';
import User from '@/views/user/User';
import Message from '@/views/message/Message';

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
            path: '/detail/:id/update',
            components: {
                header: CoHeader,
                main: Update
            }
        },
        {
            path: '/user/:id',
            components: {
                header: CoHeader,
                main: User
            }
        },
        {
            path: '/message',
            components: {
                header: CoHeader,
                main: Message
            }
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});
