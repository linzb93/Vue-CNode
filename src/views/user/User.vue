<template>
    <container :load="loadStatus" errorMsg="用户不存在">
        <div class="user-container wrapper clearfix">
            <el-row :gutter="30">
                <el-col :span="6">
                    <div class="user-sidebar">
                        <p class="text-center"><img :src="avatar" alt=""></p>
                        <p>昵称：{{name}}</p>
                        <p>积分：{{score}}</p>
                        <p><i class="fa fa-github"></i> <a :href="'https:www.github.com/' + githubName" target="_blank">@{{githubName}}</a></p>
                        <p>注册时间：{{create_at | ago}}</p>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="user-main">
                        <div class="topic-block">
                            <h2>最近创建的话题</h2>
                            <ul v-if="recent_topics.length > 0">
                                <li v-for="topic in recent_topics" :key="topic.id">
                                    <h3><a :href="'#/detail/' + topic.id">{{topic.title}}</a></h3>
                                    <span class="date">{{topic.last_reply_at | ago}}</span>
                                </li>
                            </ul>
                            <empty-tips v-else />
                        </div>
                        <div class="topic-block">
                            <h2>最近回复的话题</h2>
                            <ul v-if="recent_replies.length > 0">
                                <li v-for="reply in recent_replies" :key="reply.id">
                                    <h3><a :href="'#/detail/' + reply.id">{{reply.title}}</a></h3>
                                    <span class="date">{{reply.last_reply_at | ago}}</span>
                                </li>
                            </ul>
                            <empty-tips v-else />
                        </div>
                        <div class="topic-block" v-if="isLoginUser">
                            <h2>我收藏的话题</h2>
                            <ul v-if="collectList.length > 0">
                                <li v-for="(item, index) in collectList" :key="item.id">
                                    <h3><a :href="'#/detail/' + item.id">{{item.title}}</a></h3>
                                    <el-button class="btn-collect" type="primary" @click="decollect(item.id, index)">取消收藏</el-button>
                                </li>
                            </ul>
                            <empty-tips v-else />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </container>
</template>

<script>
    import { getUserDetail, getUserCollect, decollectTopic } from '@/service';
    import { mapState } from 'vuex';
    import { ago } from '@/filter';
    import Container from '@/views/layout/Container';
    import EmptyTips from '@/components/Empty';

    export default {
        name: 'User',
        components: {
            Container,
            EmptyTips
        },
        data() {
            return {
                loadStatus: 'loading',
                avatar: '',
                name: '',
                create_at: '',
                score: 0,
                githubName: '',
                recent_replies: [],
                recent_topics: [],
                collectList: []
            }
        },
        computed: {
            ...mapState(['token']),
            isLoginUser() {
                return this.name === this.$store.state.userInfo.name;
            }
        },
        methods: {
            render(toUserId) {
                var userId = toUserId || this.$route.params.id;
                getUserDetail(userId)
                .then(res => {
                    var data = res.data.data;
                    this.avatar = data.avatar_url;
                    this.name = data.loginname;
                    this.score = data.score;
                    this.githubName = data.githubUsername;
                    this.create_at = data.create_at;
                    this.recent_topics = data.recent_topics
                    .filter((item, index) => index < 10)
                    .map(({id, last_reply_at, title}) => ({
                        id,
                        last_reply_at,
                        title
                    }));
                    this.recent_replies = data.recent_replies
                    .filter((item, index) => index < 10)
                    .map(({id, last_reply_at, title}) => ({
                        id,
                        last_reply_at,
                        title
                    }));
                    this.loadStatus = 'complete';
                }).catch(error => {
                    this.loadStatus = 'error';
                });

                if (this.isLoginUser) {
                    getUserCollect(userId)
                    .then(res => {
                        var data = res.data.data;
                        this.collectList = data.map(({id, title}) => ({
                            id,
                            title
                        }))
                    });
                }
            },
            decollect(id, index) {
                decollectTopic(this.token, id)
                .then(res => {
                    this.collectList.splice(index, 1);
                });
            }
        },
        created() {
            this.render();
        },
        beforeRouteUpdate(to, from, next) {
            var toUserId = to.params.id || '';
            this.render(toUserId);
            next();
        }
    }
</script>

<style lang="scss">
    @import "../../style/assist/mixin";

    main .user-container {
        background: none;
        a {
            color: #333;
            &:hover {
                color: #21a9de;
            }
        }
    }
    .user-sidebar {
        padding: 30px 0;
        background: #fff;
        img {
            width: 130px;
            height: 130px;
            margin-bottom: 20px;
        }
        p {
            padding: 10px 15px;
            color: #333;
        }
        .fa-github {
            margin-right: 6px;
            font-size: 16px;
            vertical-align: middle;
        }
        a {
            color: #333;
        }
    }
    .user-main {
        padding: 0 25px 30px;
        background: #fff;
        .topic-block {
            padding-top: 30px;
        }
        h2 {
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: bold;
            color: #333;
        }
        li {
            margin-bottom: 12px;
            position: relative;
            font-size: 16px;
            line-height: 36px;
        }
        h3 {
            @include ellipse;
            padding-right: 110px;
        }
        .date {
            position: absolute;
            right: 0;
            top: 2px;
            font-size: 12px;
            color: #999;
        }
        .btn-collect {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
</style>
