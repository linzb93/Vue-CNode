<template>
    <main>
        <div class="message-main wrapper">
            <div class="message-block">
                <div class="clearfix">
                    <h3>未读消息</h3>
                    <a class="btn-read-all" href="javascript:;" @click="markAllRead" v-if="unread_length !== 0">标记所有消息为已读</a>
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
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import EmptyTips from '@/components/Empty';
    import { getAllMsg, markAllMsgRead, markOneMsgRead } from '@/service';

    export default {
        name: 'Message',
        components: {
            EmptyTips
        },
        data() {
            return {
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
                this.$router.push(`#/detail/${msg.topicId}`);
            }
        },
        created() {
            this.render();
        }
    }
</script>

<style lang="scss">
    @import "../../style/assist/mixin";
    
    .message-main {
        padding: 15px 0;
    }
    .message-block {
        margin: 30px;
        h3 {
            font-size: 20px;
            color: #333;
        }
        a {
            color: #21a9de;
        }
        span {
            margin: 0 5px;
        }
        .btn-read-all {
            float: right;
            color: #21a9de;
        }
    }
    .message-con {
        margin-top: 15px;
        li {
            margin-bottom: 10px;
        }
    }
</style>
