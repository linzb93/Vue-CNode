<template>
    <main>
        <div class="update-container wrapper" v-if="canUpdate">
            <editor
            type="post"
            header="编辑主题"
            :title="title"
            :tab="tab"
            :load="loaded"
            :content="content"
            @post="updateThisTopic"/>
        </div>
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import toMarkDown from 'to-markdown';
    import Editor from '@/components/Editor';
    import { getTopicDetail, updateTopic } from '@/service';

    export default {
        name: 'Update',
        components: {
            Editor
        },
        data() {
            return {
                topic_id: '',
                tab: '',
                title: '',
                content: '',
                loaded: false,
                canUpdate: false
            }
        },
        computed: {
            ...mapState(['token']),
            loginname() {
                return this.$store.state.userInfo.name;
            }
        },
        methods: {
            render() {
                var ctx = this;
                if (!this.token) {
                    this.$message({
                        type: 'warning',
                        message: '请先登录',
                        onClose() {
                            ctx.$router.push('/login');
                        }
                    });
                    return;
                }
                this.topic_id = this.$route.params.id;
                getTopicDetail(this.token, this.topic_id)
                .then(res => {
                    var data = res.data.data;
                    if (data.author.loginname !== this.loginname) {
                        this.$message({
                            type: 'error',
                            message: '您没有编辑此帖子的权限',
                            onClose() {
                                ctx.$router.push('/');
                            }
                        });
                        return;
                    }
                    this.canUpdate = true;
                    this.title = data.title;
                    this.tab = data.tab;
                    this.loaded = true;
                    var con = data.content.replace('<div class="markdown-text">', '').replace('</div>', '');
                    this.content = toMarkDown(con);
                });
            },
            updateThisTopic(option) {
                var ctx = this;
                updateTopic({
                    accesstoken: ctx.token,
                    topic_id: ctx.topic_id,
                    tab: option.tab,
                    title: option.title,
                    content: option.content
                })
                .then(res => {
                    var ctx = this;
                    this.$message({
                        type: 'success',
                        message: '编辑成功！',
                        onClose() {
                            ctx.$router.push(`#/detail/${ctx.topic_id}`) ;
                        }
                    });
                })
            }
        },
        created() {
            this.render();
        }
    };
</script>

<style lang="scss">

</style>
