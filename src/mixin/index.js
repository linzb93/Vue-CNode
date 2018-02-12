export var loginMixin = {
    methods: {
        loginValidate() {
            var ctx = this;
            if (!this.token) {
                this.loadStatus = 'error';
                this.$message({
                    type: 'error',
                    message: '请先登录222',
                    onClose() {
                        ctx.$store.commit('SWITCH_LOGIN_MODAL', true);
                    }
                })
            }
        }
    }
}