<template>
    <el-dialog
        title="登录"
        size="tiny"
        :visible="true"
        :show-close="false"
        @close="cancel">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item
                label="Token"
                label-width="50px"
                label-position="left"
                prop="token"
                >
                <el-input
                    placeholder="请输入token"
                    size="small"
                    v-model.lazy.trim="ruleForm.token">
                </el-input>
            </el-form-item>
            <p class="login-form-tips">
                <a href="https://cnodejs.org/setting" target="_blank">如何查看 Access Token？</a>
            </p>
            <el-form-item>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import { tokenValidate } from '@/service';
    import { ls } from '@/utils/store';
    
    export default {
        name: 'Login',
        data() {
            var vToken = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('token不能为空'))
                } else {
                    this.loginHandle(value, callback);
                }
            };
            return {
                canSubmit: true,
                ruleForm: {
                    token: ''
                },
                rules: {
                    token: [
                        { validator: vToken, trigger: 'submit'}
                    ]
                }
            }
        },
        methods: {
            cancel() {
                this.$router.go(-1);
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
                            ctx.$router.go(-1);
                        }
                    });
                    callback();
                }).catch(res => {
                    callback(new Error('token不正确'));
                });
            }
        },
        created() {
            if (ls.store('token')) {
                this.$router.go(-1);
            }
        }
    };
</script>

<style lang="scss">
    .login-form-tips {
        margin-top: 9px;
        text-align: right;
        a {
            color: #333;
        }
    }
</style>
