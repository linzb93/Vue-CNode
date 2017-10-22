<template>
    <container :load="loadStatus" errorMsg="帖子不存在">
        <div class="detail-container wrapper">
            <!-- 楼主发的 -->
            <h1>{{title}}</h1>
            <div class="topic-info clearfix">
                <span>发帖日期： {{date | ago}}</span>
                <span>作者： <a :href="'#/user/' + author">{{author}}</a></span>
                <a class="btn-update-topic" :href="'#/detail/' + topic_id + '/update'" v-if="isMyTopic" title="编辑">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                </a>
                <a class="btn-collect" href="javascript:;" v-if="!isCollected && token" @click="collectThisTopic">收藏本帖</a>
                <a class="btn-collect on" href="javascript:;" v-else-if="isCollected" @click="decollectThisTopic">取消收藏</a>
            </div>
            <div class="topic-level1" v-html="content"></div>
            <!-- /楼主发的 -->            
            <div class="topic-level-split"></div>
            <!-- 回帖 -->
            <p class="reply-count">共<span>{{replyCount}}</span>条回复</p>
            <ul class="topic-level-list">
                <li v-for="(reply, index) in showReplyList" :key="reply.id">
                    <div class="topic-level-top clearfix">
                        <a class="user-name" :href="'#/user/' + reply.author">{{reply.author}}</a>
                        <span class="tag-author" v-if="reply.author === author">[作者]</span>
                        <span class="level-num">{{index + 1}}楼</span>
                        <span class="date">发布于：{{reply.date | ago}}</span>
                        <i class="fa fa-reply" aria-hidden="true" title="回复" @click="beforeReplyLevel(reply)"></i>
                        <span
                            :class="['like', reply.is_uped ? 'on' : '']"
                            :title="reply.is_uped ? '取消点赞' : '点赞'"
                            @click="switchLike(reply)"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>{{reply.upnum}}</span>
                    </div>
                    <div class="topic-main" v-html="reply.content"></div>
                    <editor
                        :header="'回复' + reply.author"
                        :reply="reply"
                        type="replyLevel"
                        v-if="reply.showEditor"
                        @post="replyTopic"/>
                </li>
            </ul>
            <div class="load-more" @click="loadMore" v-show="!loadAllReplies">加载更多</div>
            <!-- /回帖 -->            
            <editor header="回复帖子" type="reply" @post="replyTopic"/>
        </div>
        <to-top />
    </container>
</template>

<script>
    import { mapState } from 'vuex';
    import { getTopicDetail, collectTopic, decollectTopic, upReply, createReply } from '@/service';
    import { ago } from '@/filters';
    import Container from '@/views/layout/Container';
    import Editor from '@/components/Editor';
    import ToTop from '@/components/ToTop';
    
    export default {
        name: 'Detail',
        components: {
            Container,
            Editor,
            ToTop
        },
        data() {
            return {
                loadStatus: 'loading',
                topic_id: '',
                title: '',
                date: '',
                author: '',
                content: '',
                isCollected: false,
                replyCount: 0,
                replyList: [],
                loadReplyPage: 1
            }
        },
        computed: {
            ...mapState(['token']),
            loginname() {
                return this.$store.state.userInfo.name;
            },
            isMyTopic() {
                return this.author === this.loginname;
            },
            loadAllReplies() {
                return this.replyList.length === this.showReplyList.length;
            },
            showReplyList() {
                return this.replyList.filter((item, index) => index < 10 * this.loadReplyPage);
            }
        },
        methods: {
            render(toTopicId) {
                this.topic_id = toTopicId || this.$route.params.id;
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
                    this.loadStatus = 'complete';
                })
                .catch(error => {
                    this.loadStatus = 'error';
                });
            },
            collectThisTopic() {
                collectTopic(this.token, this.topic_id)
                .then(res => {
                    this.isCollected = true;
                });
            },
            decollectThisTopic() {
                decollectTopic(this.token, this.topic_id)
                .then(res => {
                    this.isCollected = false;
                });
            },
            loadMore() {
                this.loadReplyPage++;
            },
            switchLike(reply) {
                if (!this.token) {
                    this.$message({
                        type: 'warning',
                        message: '请先登录！'
                    });
                    return;
                }
                if (this.loginname === reply.author) {
                    this.$message({
                        type: 'error',
                        message: '不能给自己点赞'
                    });
                    return;
                }
                upReply(this.token, reply.id)
                .then(res => {
                    reply.upnum += reply.is_uped ? -1 : 1;
                    reply.is_uped = !reply.is_uped;
                });
            },
            beforeReplyLevel(reply) {
                if (!this.token) {
                    this.$message({
                        type: 'warning',
                        message: '请先登录！'
                    });
                    return;
                }
                reply.showEditor = !reply.showEditor;
            },
            replyTopic(option) {
                var ctx = this;
                var content = option.reply.id ? `@${option.reply.author} ${option.content}` : option.content;
                createReply({
                    topic_id: ctx.topic_id,
                    accesstoken: ctx.token,
                    content,
                    reply_id: option.reply.id
                })
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '回复成功！',
                        onClose() {
                            ctx.render();
                        }
                    });
                });
            }
        },
        created() {
            this.render();
        },
        beforeRouteUpdate(to, from, next) {
            var toTopicId = to.params.id || '';
            this.render(toTopicId);
            next();
        }
    };
</script>

<style lang="scss">
    @import "../../style/assist/variable";    

    .detail-container {
        padding: 1px 30px;
        font-size: 16px;
        &.wrapper {
            width: 1140px;
        }
        & > h1 {
            padding-bottom: 30px;
        }
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
            .fa-pencil-square-o {
                color: #666;
            }
        }
        .tag-author {
            float: left;
            color: #666;
            margin-left: 5px;
            position: relative;
            top: 1px;
        }
        .btn-collect {
            float: right;
            width: 70px;
            height: 30px;
            background: $mainColor;
            color: #fff;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
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
            word-break: break-all;
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
                white-space: pre-wrap;
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
            em {
                font-style: italic;
            }
            blockquote {
                padding: 3px 15px;
                border-left: 3px solid #ccc;
                margin-left: 0;
                p {
                    margin-bottom: 0;
                }
            }
            table {
                padding: 0;
                border-collapse: collapse;
                border-spacing: 0;
                font: inherit;
                max-width: 100%;
                margin-bottom: 15px;
            }
            tr {
                border-top: 1px solid #ccc;
                background-color: #fff;
                margin: 0;
                padding: 0;
                &:nth-child(2n) {
                    background-color: #f8f8f8;
                }
            }
            th, td {
                border: 1px solid #ccc;
                text-align: left;
                margin: 0;
                padding: 6px 13px;
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
        .load-more {
            cursor: pointer;
            width: 200px;
            height: 40px;
            border: $border;
            font-size: 16px;
            text-align: center;
            color: #333;
            line-height: 40px;
            margin: 0 auto 10px;
            &:hover {
                background: #e0e0e0;
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
