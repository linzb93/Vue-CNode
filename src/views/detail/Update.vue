<template>
    <container :load="loadStatus" :errorMsg="loadErrorMsg">
        <div class="update-container wrapper">
            <editor type="post" header="编辑主题" :title="title" :tab="tab" :content="content" @post="updateThisTopic"/>
        </div>
    </container>
</template>

<script>
    import { mapState } from 'vuex';
    import toMarkDown from 'to-markdown';
    import Container from '@/views/layout/Container';
    import Editor from '@/components/Editor';
    import { getTopicDetail, updateTopic } from '@/service';

    export default {
        name: 'Update',
        components: {
            Container,
            Editor
        },
        data() {
            return {
                loadStatus: 'loading',
                loadErrorMsg: '',
                topic_id: '',
                tab: '',
                title: '',
                content: ''
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
                    this.loadStatus = 'error';
                    this.loadErrorMsg = '请先登录';
                    return;
                }
                this.topic_id = this.$route.params.id;
                getTopicDetail(this.token, this.topic_id)
                .then(res => {
                    var data = res.data.data;
                    if (data.author.loginname !== this.loginname) {
                        this.loadStatus = 'error';
                        this.loadErrorMsg = '您没有编辑此帖子的权限';
                        return;
                    }
                    this.title = data.title;
                    this.tab = data.tab;
                    
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
                            ctx.$router.push(`/detail/${ctx.topic_id}`) ;
                        }
                    });
                })
                .catch(error => {
                    this.$message({
                        type: 'error',
                        message: '帖子不存在',
                        onClose() {
                            ctx.$router.push('/');
                        }
                    })
                })
            }
        },
        created() {
            this.render();
        }
    };
</script>
