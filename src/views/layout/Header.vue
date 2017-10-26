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
            <a class="btn-login" href="javascript:;" @click="switchLoginDialog(true)" v-else>登录</a>
        </div>
        <el-dialog title="登录" size="tiny" :visible="isShowedLoginDialog" :show-close="false">
            <el-form :model="ruleForm" :rules="rules" ref="loginForm">
                <el-form-item label="Token" label-width="50px" label-position="left" prop="token">
                    <el-input placeholder="请输入token" size="small" v-model.lazy.trim="ruleForm.token">
                    </el-input>
                </el-form-item>
                <p class="login-form-tips">
                    <a href="https://cnodejs.org/setting" target="_blank">如何查看 Access Token？</a>
                </p>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">确定</el-button>
                    <el-button @click="switchLoginDialog(false)">取消</el-button>                    
                </el-form-item>
            </el-form>
        </el-dialog>
    </header>
</template>

<script>
    import { mapState } from 'vuex';
    import { tokenValidate, getUnreadMsgCount } from '@/service';
    import { ls } from '@/utils/store';

    export default {
        name: 'Header',
        data() {
            var ctx = this;
            var vToken = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('token不能为空'))
                } else {
                    this.loginHandle(value, callback);
                }
            };

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
                ],
                canSubmit: true,
                ruleForm: {
                    token: ''
                },
                rules: {
                    token: [
                        {
                            validator: vToken,
                            trigger: 'submit'
                        }
                    ]
                }
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
            ...mapState(['token', 'hasUnreadMsg', 'isShowedLoginDialog'])
        },
        methods: {
            logout() {
                this.$store.commit('LOGOUT');
            },
            switchLoginDialog(isShowed) {
                this.$store.commit('SWITCH_LOGIN_MODAL', isShowed);
                if (!isShowed) {
                    this.$refs.loginForm.resetFields();
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                });
            },
            loginHandle(token, callback) {
                this.canSubmit = false;
                setTimeout(() => {
                    this.canSubmit = true;
                }, 3000);
                tokenValidate(token)
                .then(res => {
                    var data = res.data;
                    var ctx = this;
                    this.$store.commit('SAVE_INFO', {
                        name: data.loginname,
                        id: data.id,
                        avatar: data.avatar_url
                    });
                    this.$store.commit('SAVE_TOKEN', token);
                    ls.store('token', token);
                    this.$message({
                        type: 'success',
                        message: '登录成功!',
                        duration: 1000,
                        onClose() {
                            ctx.$store.commit('SWITCH_LOGIN_MODAL', false);                            
                        }
                    });
                    callback();
                }).catch(res => {
                    callback(new Error('token不正确'));
                });
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
    @import "../../style/assist/variable"; 
    
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
                color: $titleColor;
                font-size: 14px;
                &:hover {
                    background: #eee;
                    text-decoration: none;
                }
            }
        }
    }
    .login-form-tips {
        margin-top: 9px;
        text-align: right;
        a {
            color: $conColor;
        }
    }
</style>
