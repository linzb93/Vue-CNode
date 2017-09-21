<template>
    <main>
        <div class="wrapper">
            <div class="topic-tab">
                <a
                    v-for="(tab, index) in tabs"
                    :key="tab.id"
                    :class="tab.active"
                    @click="tabSwitch(tab.id, index)"
                    href="javascript:;">
                    {{tab.name}}
                </a>
            </div>
            <ul class="index-list" v-show="!showEmptyTips">
                <li class="clearfix" v-for="topic in topics" :key="topic.id">
                    <a class="author-avatar" :href="'#/user/' + topic.author">
                        <img :src="topic.avatar" :alt="topic.author">
                    </a>
                    <div class="topic-stats">
                        <span class="reply-count">{{topic.reply_count | shorten}}</span>
                        <span class="split">/</span>
                        <span class="visit-count">{{topic.visit_count | shorten}}</span>
                    </div>
                    <h3>
                        <a :href="'#/detail/' + topic.id">{{topic.title}}</a>
                    </h3>
                    <span class="topic-tag topic-top" v-if="topic.top">[置顶]</span>
                    <span class="topic-tag topic-good" v-if="topic.good">[精华]</span>
                    <div class="topic-time">
                        <p>发帖时间：{{topic.create_at | ago}}</p>
                        <p>最近回帖时间：{{topic.last_reply_at | ago}}</p>
                    </div>
                </li>
            </ul>
            <pagination
            :isLastPage="isLastPage"
            @change="changePage"
            v-model="changeTab"
            v-show="!showEmptyTips"></pagination>
            <empty-tips v-show="showEmptyTips" />
        </div>
    </main>
</template>

<script>
    import { ls } from '@/utils/store';
    import { getTopicList } from '@/service';
    import { shorten, ago } from '@/filter';
    import Pagination from '@/components/Pagination';
    import EmptyTips from '@/components/Empty';

    export default {
        name: 'Index',
        components: {
            Pagination,
            EmptyTips
        },
        data() {
            return {
                tabs: [
                    {
                        id: 'all',
                        name: '全部'
                    },
                    {
                        id: 'good',
                        name: '精华'
                    },
                    {
                        id: 'share',
                        name: '分享'
                    },
                    {
                        id: 'ask',
                        name: '问答'
                    },
                    {
                        id: 'job',
                        name: '招聘'
                    },
                ],
                tabId: 'all',
                topics: [],
                showEmptyTips: false, //无内容返回时显示
                changeTab: false, //分页重置的标志
                isLastPage: false //是否是最后一页
            };
        },
        methods: {
            getTopicList(tab = '', page = 1) {
                getTopicList(tab, page)
                .then(res => {
                    if (res.data.data.length === 0) {
                        this.topics = [];
                        this.showEmptyTips = true;
                        return;
                    }
                    this.isLastPage = res.data.data.length < 20;
                    this.showEmptyTips = false;
                    this.topics = res.data.data.map(item => {
                        return {
                            author: item.author.loginname,
                            avatar: item.author.avatar_url,
                            id: item.id,
                            create_at: item.create_at,
                            good: item.good,
                            last_reply_at: item.last_reply_at,
                            reply_count: item.reply_count,
                            title: item.title,
                            top: item.top,
                            visit_count: item.visit_count
                        }
                    });
                });
            },
            tabInit() {
                //标签初始化
                this.tabs.forEach((item, index) => {
                    this.$set(item, 'active', index === 0 ? 'on' : '');
                });
            },
            tabSwitch(id, tabIndex) {
                //标签切换
                this.tabs.forEach((item, index) => {
                    this.$set(item, 'active', index === tabIndex ? 'on' : '');
                });
                this.tabId = id;
                this.changeTab = !this.changeTab;
                this.getTopicList(id);
            },
            changePage(curPage) {
                this.getTopicList(this.tabId, curPage);
            }
        },
        created() {
            this.getTopicList();
            this.tabInit();
        }
    };
</script>

<style lang="scss">
    @import "../../style/assist/mixin";

    .topic-tab {
        background: #f5f5f5;
        padding: 10px;
        a {
            padding: 5px;
            color: #80bd01;
            margin: 0 10px;
            border-radius: 2px;
            &:hover {
                color: #9ee805;
                text-decoration: none;
            }
            &.on {
                color: #fff;
                background: #80bd01;
            }
        }
    }
    .index-list {
        li {
            padding: 10px;
            &:hover {
                background: #f5f5f5;
            }
        }
        .author-avatar {
            float: left;
            width: 30px;
            height: 30px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .topic-stats {
            float: left;
            width: 80px;
            text-align: center;
            margin-left: 14px;
        }
        .reply-count {
            color: #9e78c0;
        }
        .split {
            color: #666;
        }
        .visit-count {
            font-size: 12px;
            color: #999;
        }
        h3 {
            @include ellipse;
            float: left;
            vertical-align: top;
            font-size: 16px;
            max-width: 600px;
            margin-right: 10px;
            a {
                color: #333;
            }
        }
        .topic-tag {
            float: left;
            margin: 0 3px;
        }
        .topic-top {
            color: #80bd01;
        }
        .topic-good {
            color: #ef4141;
        }
        .topic-time {
            float: right;
            width: 200px;
            text-align: right;
            color: #666;
            line-height: 2;
        }
    }
</style>
