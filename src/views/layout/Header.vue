<template>
    <header>
        <div class="wrapper clearfix">
            <h1 class="logo">
                <a href="#/">
                    <img src="https://o4j806krb.qnssl.com/public/images/cnodejs_light.svg" alt="">
                </a>
            </h1>
            <nav>
                <el-badge v-for="item in nav" :key="item.name" :is-dot="item.isDot">
                    <a :href="item.url">{{item.name}}</a>
                </el-badge>
            </nav>
            <div class="login-info" v-if="isLogin">
                <img class="avatar" :src="avatar" alt="">
                <span class="username">{{username}}</span>
                <div class="user-popup">
                    <a :href="'#/user/' + username">个人中心</a>
                    <a @click="logout" href="javascript:;">退出</a>
                </div>
            </div>
            <a class="btn-login" href="#/login" v-else>登录</a>
        </div>
    </header>
</template>

<script>
    import { mapState } from 'vuex';
    import { getUnreadMsgCount } from '@/service';

    export default {
        name: 'Header',
        data() {
            var ctx = this;
            return {
                nav: [
                    {
                        name: '首页',
                        url: '#/',
                        isDot: false,
                    },
                    {
                        name: '消息',
                        url: '#/message',
                        isDot: ctx.hasUnreadMsg
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
            },
            ...mapState(['token', 'hasUnreadMsg'])
        },
        methods: {
            logout() {
                this.$store.commit('LOGOUT');
            }
        },
        created() {
            if (this.isLogin) {
                getUnreadMsgCount(this.token)
                .then(res => {
                    if (res.data.data > 0) {
                        this.$store.commit('TOGGLE_UNREAD_MSG_STATE', true);
                    }
                });
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
            left: -10px;
            top: 30px;
            width: 80px;
            border-radius: 2px;
            background: #fff;
            z-index: 5;
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
