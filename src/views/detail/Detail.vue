<template>
    <main>
        <div class="detail-container wrapper">
            <h1>{{title}}</h1>
            <div class="topic-info clearfix">
                <span>发帖日期： {{date | ago}}</span>
                <span>作者： <a :href="'#/user/' + author">{{author}}</a></span>
                <a class="btn-collect" href="javascript:;" v-if="!isCollected" @click="collectTopic()">收藏本帖</a>
                <a class="btn-collect on" href="javascript:;" v-if="isCollected" @click="decollectTopic()">取消收藏</a>
            </div>
            <div class="topic-level1" v-html="content"></div>
            <div class="topic-level-split"></div>
            <p class="reply-count">共<span>{{replyCount}}</span>条回复</p>
            <ul class="topic-level-list">
                <li v-for="(reply, index) in replyList" :key="reply.id">
                    <div class="topic-level-top clearfix">
                        <a class="user-name" :href="'#/user/' + reply.author">{{reply.author}}</a>
                        <span class="level-num">{{index + 1}}楼</span>
                        <span class="date">发布于：{{reply.date | ago}}</span>
                        <i class="fa fa-reply" aria-hidden="true" title="回复" @click="replyLevel(reply)"></i>
                        <span
                            :class="['like', reply.is_uped ? 'on' : '']"
                            :title="reply.is_uped ? '取消点赞' : '点赞'"
                            @click="switchLike(reply)"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>{{reply.upnum}}</span>
                    </div>
                    <div class="topic-main" v-html="reply.content"></div>
                    <editor :title="'回复' + reply.author" type="reply" v-if="reply.showEditor"/>
                </li>
            </ul>
            <editor title="回复帖子" type="post"/>
        </div>
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import { getTopicDetail, collectTopic, decollectTopic, upReply } from '@/service';
    import { ago } from '@/filter';
    import Editor from '@/components/Editor';
    
    export default {
        name: 'Detail',
        data() {
            return {
                topic_id: '',
                title: '',
                date: '',
                author: '',
                content: '',
                isCollected: false,
                replyCount: 0,
                replyList: []
            }
        },
        components: {
            Editor
        },
        computed: {
            ...mapState(['token'])
        },
        methods: {
            checkLogin() {
                var ctx = this;
                if (!this.token) {
                    this.$message({
                        type: 'error',
                        message: '您还未登录！',
                        onClose() {
                            ctx.$router.push('#/login');
                        }
                    })
                }
            },
            collectTopic() {
                checkLogin();
                collectTopic(this.token, this.topic_id)
                .then(res => {
                    this.isCollected = true;
                });
            },
            decollectTopic() {
                decollectTopic(this.token, this.topic_id)
                .then(res => {
                    this.isCollected = false;
                });
            },
            switchLike(reply) {
                upReply(this.token, reply.id)
                .then(res => {
                    reply.upnum += reply.is_uped ? -1 : 1;
                    reply.is_uped = !reply.is_uped;
                });
            },
            replyLevel(reply) {
                reply.showEditor = true;
            }
        },
        created() {
            this.topic_id = this.$route.params.id;
            getTopicDetail(this.token, this.topic_id)
            .then(res => {
                var data = res.data.data;
                this.author = data.author.loginname;
                this.title = data.title;
                this.date = data.create_at;
                this.content = data.content;
                this.isCollected = data.is_collect;
                this.replyCount = data.replies.length;
                this.replyList = data.replies.map(item => {
                    return {
                        id: item.id,
                        author: item.author.loginname,
                        date: item.create_at,
                        content: item.content.replace(/\/user/g, '#/user'),
                        is_uped: item.is_uped,
                        upnum: item.ups.length,
                        showEditor: false
                    };
                });
            });
        }
    };
</script>

<style lang="scss">
    @import "../../style/assist/variable";    

    .detail-container {
        padding: 1px 30px;
        h1 {
            font-size: 24px;
            color: #333;
            padding-top: 30px;
            text-align: center;
        }
        .topic-info {
            border-bottom: $border;
            padding-bottom: 6px;
            span {
                margin-right: 25px;
                color: #666;
                a {
                    color: #666;
                }
            }
        }
        .btn-collect {
            float: right;
            width: 70px;
            height: 30px;
            background: $mainColor;
            color: #fff;
            text-align: center;
            line-height: 30px;
            &.on {
                background: #999;
                &:hover {
                    background: lighten(#999, 5%);
                }
            }
            &:hover {
                text-decoration: none;
                background: lighten($mainColor, 5%);
            }
        }
        .topic-level1 {
            margin-top: 30px;
        }
        .topic-level1,
        .topic-main {
            line-height: 2;
            h1,h2,h3,h4,h5,h6 {
                margin-bottom: 0.5em;
                font-weight: bold;
                color: #333;
                line-height: 1.5;
                border-bottom: $border;
                a:hover {
                    text-decoration: none;
                }
            }
            h1 {
                font-size: 28px;
                text-align: left;
            }
            h2 {
                font-size: 24px;
            }
            h3 {
                font-size: 22px;
            }
            h4 {
                font-size: 20px;
            }
            h5 {
                font-size: 18px;
            }
            h6 {
                font-size: 16px;
            }
            img {
                max-width: 100%;
                margin-bottom: 10px;
            }
            p {
                margin-bottom: 1em;
                color: #666;
            }
            a {
                color: #21a9de;
                margin-bottom: 1em;
            }
            code {
                color: #666;
            }
            ul {
                margin-bottom: 1em;
            }
            li {
                margin-left: 18px;
                list-style-type: disc;
            }
            blockquote {
                padding: 3px 15px;
                border-left: 3px solid #ccc;
                margin-left: 0;
                p {
                    margin-bottom: 0;
                }
            }
        }
        .topic-level-split {
            margin: 10px -30px;
            height: 10px;
            background: #e1e1e1;
        }
        .reply-count {
            color: #666;
            border-bottom: $border;
            padding-bottom: 8px;
            span {
                margin: 0 2px;
                color: #f00;
            }
        }
        .topic-level-list {
            li {
                padding: 10px 0;
                border-bottom: $border;
                &:last-child {
                    border-bottom: 0;
                }
            }
            .user-name {
                font-size: 16px;
                font-weight: bold;
                float: left;
                color: #333;
            }
            .level-num {
                color: #666;
                margin: 1px 0 0 10px;
                float: left;
            }
            .date {
                margin: 1px 0 0 10px;
                float: left;
                color: #666;
            }
            .like {
                cursor: pointer;
                float: right;
                &:hover,
                &.on {
                    color: $linkColor;
                }
                .fa-thumbs-o-up {
                    margin-right: 3px;
                }
            }
            .fa-reply {
                cursor: pointer;
                float: right;
                margin: 4px 0 0 10px;
                &:hover {
                    color: $linkColor;
                }
            }
        }
        .topic-main {
            margin-top: 8px;
            li {
                padding: 0;
                border-bottom: 0;
            }
        }
        .topic-bottom {
            a {
                color: $linkColor;
                margin-right: 10px;
            }
        }
        .post-editor-container {
            padding: 15px 0;
            h3 {
                margin-bottom: 8px;
            }
        }
    }
    pre.prettyprint {
        font-size: 14px;
        border-radius: 0;
        padding: 0 15px;
        border: none;
        margin: 20px -10px;
        border-width: 1px 0;
        background: #f7f7f7;
        -o-tab-size: 4;
        -moz-tab-size: 4;
        tab-size: 4;
        code {
            color: inherit;
            white-space: pre-wrap;
            background-color: transparent;
        }
        .pln {
            color: #000;
        }
        .clo, .opn, .pun {
            color: #660;
        }
    }
</style>
