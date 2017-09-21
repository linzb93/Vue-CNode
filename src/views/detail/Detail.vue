<template>
    <main>
        <div class="detail-container wrapper">
            <h1>{{title}}</h1>
            <div class="topic-info clearfix">
                <span>发帖日期： {{date | ago}}</span>
                <span>作者： {{author}}</span>                
                <a 
                    :class="['btn-collect', collected ? 'on' : '']"
                    href="javascript:;"
                    @click="switchCollect(collected)">
                    {{collectText}}
                </a>
            </div>
            <div class="topic-level1" v-html="content"></div>
            <ul class="topic-level-list">
                <li v-for="(reply, index) in replyList" :key="reply.id">
                    <div class="topic-level-top">
                        <span class="level-num">{{index + 1}}楼</span>
                        <span class="user-name">{{reply.author}}</span>
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
    import { getTopicDetail } from '@/service';
    import { ago } from '@/filter';
    
    export default {
        name: 'Detail',
        data() {
            return {
                title: '',
                date: '',
                author: '',
                content: '',
                collected: false,
                collectText: '收藏本帖',
                replyCount: 0,
                replyList: []
            }
        },
        computed: {
            ...mapState(['token'])
        },
        methods: {
            switchCollect(collected) {
                this.collected = !collected;
                this.collectText = collected ? '收藏本帖' : '取消收藏';
            }
        },
        created() {
            var id = this.$route.params.id;
            getTopicDetail(this.token, id)
            .then(res => {
                // console.log(res.data);
                var data = res.data.data;
                this.author = data.author.loginname;
                this.title = data.title;
                this.date = data.create_at;
                this.content = data.content;
                this.replyList = data.replies.map(item => {
                    return {
                        author: item.author.loginname,
                        date: item.create_at,
                        content: item.content,
                        upnum: item.ups.length
                    };
                });
            });
        }
    };
</script>

<style lang="scss">
    .detail-container {
        padding: 1px 15px;
        h1 {
            font-size: 24px;
            color: #333;
            padding-top: 15px;
            text-align: center;
        }
        .topic-info {
            margin: 0 15px;
            border-bottom: 1px solid #e0e0e0;
            span {
                margin-right: 25px;
                color: #666;
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
            &.collected {
                background: #999;
            }
        }
        .topic-level1 {
            margin-top: 15px;
            line-height: 2;
            h1,h2,h3 {
                margin-bottom: 1em;
                font-weight: bold;
                color: #333;
            }
            h1 {
                font-size: 26px;
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
        
    }
</style>
