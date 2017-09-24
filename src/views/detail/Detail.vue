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
                        <span class="date">{{reply.date | ago}}</span>
                    </div>
                    <div class="topic-main" v-html="reply.content"></div>
                    <div class="topic-bottom">
                        <a href="javascript:;" title="">点赞( {{reply.upnum}} )</a>
                        <a href="javascript:;" title="">回复</a>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import { getTopicDetail, collectTopic, decollectTopic, upReply } from '@/service';
    import { ago } from '@/filter';
    
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
        computed: {
            ...mapState(['token'])
        },
        methods: {
            collectTopic() {
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
                this.replyList = data.replies.map(item => {
                    return {
                        author: item.author.loginname,
                        date: item.create_at,
                        content: item.content.replace(/\/user/g, '#/user'),
                        upnum: item.ups.length
                    };
                });
            });
        }
    };
</script>

<style lang="scss">
    .detail-container {
        padding: 1px 30px;
        h1 {
            font-size: 24px;
            color: #333;
            padding-top: 30px;
            text-align: center;
        }
        .topic-info {
            border-bottom: 1px solid #e0e0e0;
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
            background: #80bd01;
            color: #fff;
            text-align: center;
            line-height: 30px;
            &.on {
                background: #999;
            }
            &:hover {
                text-decoration: none;
            }
        }
        .topic-level1 {
            margin-top: 30px;
        }
        .topic-main {
            margin-top: 8px;
        }
        .topic-level1,
        .topic-main {
            line-height: 2;
            h1,h2,h3,h4,h5,h6 {
                margin-bottom: 0.5em;
                font-weight: bold;
                color: #333;
                line-height: 1.5;
                border-bottom: 1px solid #e0e0e0;
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
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
            span {
                color: #f00;
            }
        }
        .topic-level-list {
            li {
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
            }
            .user-name {
                font-size: 16px;
                font-weight: bold;
                float: left;
                color: #333;
            }
            .level-num {
                font-size: 14px;
                font-size: 14px;
                color: #666;
                margin-left: 10px;
                float: left;
                margin-top: 1px;
            }
            .date {
                margin-top: 1px;
                float: right;
                font-size: 14px;
                color: #666;
            }
        }
        .topic-bottom {
            a {
                color: #21a9de;
                margin-right: 10px;
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
