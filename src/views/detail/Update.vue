<template>
    <div class="update-container">
        <editor
        type="post"
        header="编辑主题"
        :title="title"
        :tab="tab"
        :load="loaded"
        :content="content"
        @post="updateTopic"/>
    </div>
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
                loaded: false
            }
        },
        computed: {
            ...mapState(['token'])
        },
        methods: {
            render() {
                this.topic_id = this.$route.params.id;
                getTopicDetail(this.token, this.topic_id)
                .then(res => {
                    var data = res.data.data;
                    this.title = data.title;
                    this.tab = data.tab;
                    this.loaded = true;
                    var con = data.content.replace('<div class="markdown-text">', '').replace('</div>', '');
                    this.content = toMarkDown(con);
                });
            },
            updateTopic(option) {
                var ctx = this;
                updateTopic({
                    accesstoken: ctx.token,
                    topic_id: ctx.topic_id,
                    tab: option.tab,
                    title: option.title,
                    content: option.content
                })
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '编辑成功！',
                        onClose() {
                            location.href = '#/detail/' + ctx.topic_id;
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
