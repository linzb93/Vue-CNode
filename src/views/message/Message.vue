<template>
    <container :load="loadStatus" errorMsg="请先登录">
        <div class="message-main wrapper" v-if="!!token">
            <div class="message-block">
                <div class="clearfix">
                    <h3>未读消息</h3>
                    <el-button type="text" class="btn-read-all" @click="markAllRead" v-if="unread_length !== 0">标记所有消息为已读</el-button>
                </div>
                <ul class="message-con" v-if="unread_msg_list.length > 0">
                    <li v-for="msg in unread_msg_list" :key="msg.id">
                        <a :href="'#/user/' + msg.author">@{{msg.author}}</a>
                        <span>回复了您的帖子</span>
                        <a @click="markThisMsgRead(msg)">{{msg.title}}</a>
                    </li>
                </ul>
                <empty-tips title="暂无未读消息" v-if="unread_msg_list.length === 0" />
            </div>
            <div class="message-block">
                <div class="clearfix">
                    <h3>已读消息</h3>
                </div>
                <ul class="message-con" v-if="read_msg_list.length > 0">
                    <li v-for="msg in read_msg_list" :key="msg.id">
                        <a :href="'#/user/' + msg.author">@{{msg.author}}</a>
                        <span>回复了您的帖子</span>
                        <a :href="'#/detail/' + msg.topicId">{{msg.title}}</a>
                    </li>
                </ul>
                <empty-tips title="暂无已读消息" v-if="read_msg_list.length === 0" />
            </div>
        </div>
    </container>
</template>

<script>
    import { mapState } from 'vuex';
    import Container from '@/views/layout/Container';
    import EmptyTips from '@/components/Empty';
    import { getAllMsg, markAllMsgRead, markOneMsgRead } from '@/service';

    export default {
        name: 'Message',
        components: {
            Container,
            EmptyTips
        },
        data() {
            return {
                loadStatus: 'loading',
                unread_msg_list: [],
                read_msg_list: [],
                unread_length: 0
            }
        },
        computed: {
            ...mapState(['token']),
        },
        methods: {
            render() {
                getAllMsg(this.token)
                .then(res => {
                    var data = res.data.data;
                    this.unread_msg_list = data.hasnot_read_messages.map(item => ({
                        id: item.id,
                        author: item.author.loginname,
                        create_at: item.create_at,
                        title: item.topic.title,
                        topicId: item.topic.id
                    }));
                    this.read_msg_list = data.has_read_messages.map(item => ({
                        id: item.id,
                        author: item.author.loginname,
                        create_at: item.create_at,
                        title: item.topic.title,
                        topicId: item.topic.id
                    }));
                    this.unread_length = this.unread_msg_list.length;
                    this.loadStatus = 'complete';
                })
                .catch(err => {
                    this.loadStatus = 'error';
                });
            },
            markAllRead() {
                markAllMsgRead(this.token)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '已成功标记所有信息为已读'
                    });
                    this.$store.commit('TOGGLE_UNREAD_MSG_STATE', false);
                    this.unread_length = 0;
                    this.render();
                });
            },
            markThisMsgRead(msg) {
                markOneMsgRead(this.token, msg.id);
                this.unread_length--;
                this.$router.push(`/detail/${msg.topicId}`);
            }
        },
        created() {
            var ctx = this;
            if (!ctx.token) {
                ctx.$message({
                    type: 'warning',
                    message: '请先登录',
                    onClose() {
                        ctx.$router.push('/login');
                    }
                });
                return;
            }
            this.render();
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                
            })
        }
    }
</script>

<style lang="scss">
    @import "../../style/assist/mixin";
    @import "../../style/assist/variable";
    
    .message-main {
        padding: 15px 0;
    }
    .message-block {
        margin: 30px;
        h3 {
            font-size: 20px;
            color: $titleColor;
            float: left;
        }
        a {
            color: $linkColor;
        }
        span {
            margin: 0 5px;
        }
        .btn-read-all {
            float: right;
            color: $linkColor;
        }
    }
    .message-con {
        margin-top: 15px;
        li {
            margin-bottom: 10px;
        }
    }
</style>
