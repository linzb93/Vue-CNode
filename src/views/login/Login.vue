<template>
    <el-dialog
        title="登录"
        size="small"
        :visible="visible">
        <el-form>
            <el-form-item
                label="Token"
                label-width="50px"
                label-position="left"
                >
                <el-input
                    placeholder="请输入token"
                    size="small"
                    v-model.lazy="token">
                </el-input>
            </el-form-item>
            <p class="login-form-tips">
                <a href="https://cnodejs.org/setting" target="_blank">如何查看 Access Token？</a>
            </p>
        </el-form>
        <div slot="footer">
            <el-button @click="loginHandle(false)">取消</el-button>
            <el-button type="primary" @click.native="loginHandle(true)">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { tokenValidate } from '@/service';
    import { ls } from '@/utils/store';
    import router from '@/router'
    
    export default {
        name: 'Login',
        data() {
            return {
                visible: false,
                token: ''
            }
        },
        methods: {
            loginHandle(isSubmit) {
                if (!isSubmit) {
                    this.$router.push('/');
                    return;
                }
                
                tokenValidate(this.token)
                .then(res => {
                    var data = res.data;
                    this.$store.commit('SAVE_INFO', {
                        name: data.loginname,
                        id: data.id,
                        avatar: data.avatar_url
                    });
                    this.$store.commit('SAVE_TOKEN', this.token);
                    ls.store('token', this.token);
                    this.$message({
                        message: '登录成功!',
                        duration: 1000,
                        onClose() {
                            router.push('/');
                        }
                    });
                });
            }
        },
        created() {
            if (ls.store('token')) {
                this.$router.push('/');
            }
            this.visible = true;
        }
    };
</script>

<style lang="scss">
    .login-form-tips {
        margin-top: 9px;
        text-align: right;
        font-size: 14px;
        a {
            color: #333;
        }
    }
</style>
