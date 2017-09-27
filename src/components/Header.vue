<template>
    <header>
        <div class="wrapper clearfix">
            <h1 class="logo">
                <a href="/">
                    <img src="https://o4j806krb.qnssl.com/public/images/cnodejs_light.svg" alt="">
                </a>
            </h1>
            <nav>
                <a v-for="item in nav" :href="item.url" :key="item.name">{{item.name}}</a>
            </nav>
            <div class="login-info" v-if="isLogin">
                <img class="avatar" :src="avatar" alt="">
                <span class="username">{{username}}</span>
                <div class="user-popup">
                    <a @click="logout" href="javascript:;">退出</a>
                </div>
            </div>
            <a class="btn-login" href="#/login" v-if="!isLogin">登录</a>
        </div>
    </header>
</template>

<script>
    export default {
        name: 'Header',
        data() {
            return {
                nav: [
                    {
                        name: '首页',
                        url: '#/'
                    },
                    {
                        name: '消息',
                        url: '#/message'
                    }
                ]
            }
        },
        computed: {
            avatar() {
                return this.$store.state.userInfo.avatar;
            },
            username() {
                return this.$store.state.userInfo.name;
            },
            isLogin() {
                return !!this.$store.state.token;
            }
        },
        methods: {
            logout() {
                this.$store.commit('LOGOUT');
            }
        }
    };
</script>

<style lang="scss">
    header {
        background: #666;
        height: 60px;
        .wrapper {
            height: 100%;
        }
        nav {
            float: left;
            margin-left: 30px;
            padding-top: 16px;
            a {
                font-size: 16px;
                line-height: 2;
                color: #fff;
                padding: 0 8px 8px;
                margin: 0 10px;
                position: relative;
                &:after {
                    content: '';
                    left: 0;
                    right: 0;
                    bottom: 5px;
                    height: 3px;
                    background: #fff;
                    position: absolute;
                    opacity: 0;
                    transition: all 0.3s;
                }
                &:hover {
                    text-decoration: none;
                    &:after {
                        bottom: 0;
                        opacity: 1;
                    }
                }
            }
        }
        .btn-login {
            float: right;
            padding-top: 16px;
            font-size: 16px;
            line-height: 2;
            color: #fff;
        }
    }
    .logo {
        float: left;
        margin-top: 13px;
        img {
            width: 120px;
            height: 28px;
        }
    }
    .login-info {
        float: right;
        position: relative;
        margin-top: 16px;
        &:hover {
            .user-popup {
                display: block;
            }
        }
        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
            cursor: pointer;
        }
        .username {
            font-size: 14px;
            color: #fff;
            margin-left: 8px;
            vertical-align: middle;
        }
        .user-popup {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            display: none;
            position: absolute;
            text-align: center;
            left: 0;
            top: 30px;
            width: 60px;
            border-radius: 2px;
            background: #fff;
            a {
                display: block;
                line-height: 2;
                color: #666;
                font-size: 14px;
                &:hover {
                    background: #eee;
                    text-decoration: none;
                }
            }
        }
    }
</style>
