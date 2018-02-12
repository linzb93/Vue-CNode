<template>
    <div :class="['editor-container', containerType]">
        <h3>{{header}}</h3>
        <div v-if="isLogin">
            <el-form :model="formModel" :rules="rules" ref="editorForm">
                <el-form-item prop="tab">
                    <el-select v-model="formModel.tab" v-if="type === 'post'" placeholder="请选择帖子分类">
                        <el-option v-for="item in tabs" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="title">
                    <el-input v-if="type === 'post'" placeholder="标题长度不少于10个字" v-model="formModel.title"/>
                </el-form-item>
                <el-form-item prop="content">
                    <markdown-editor v-model="formModel.content" :configs="configs" />
                </el-form-item>
                <el-button type="primary" @click="submit('editorForm')">提交</el-button>
            </el-form>
        </div>
        <p class="not-login-tips" v-else>发帖/回帖之前请先<a href="#/login">登录</a>。</p>
    </div>
</template>

<script>
    import MarkdownEditor from 'vue-simplemde/src/markdown-editor';
    import cloneDeep from 'lodash/cloneDeep';
    import { mapState } from 'vuex';
    import { tabs } from '@/store/constant';

    export default {
        name: 'Editor',
        components: {
            MarkdownEditor
        },
        props: {
            header: {
                required: true
            },
            type: {
                required: true,
                validator(value) {
                    return ['post', 'reply', 'replyLevel'].includes(value);
                }
            },
            reply: {
                default() {
                    return {};
                }
            },
            title: {
                default() {
                    return '';
                }
            },
            tab: {
                default() {
                    return '';
                }
            },
            content: {
                default() {
                    return '';
                }
            }
        },
        data() {
            var rules = {
                content: [
                    {
                        required: true,
                        message: '帖子内容不能为空',
                        trigger: 'blur'
                    }
                ]
            };
            if (this.type === 'post') {
                rules.tab =  [
                        {
                            required: true,
                            message: '请选择帖子分类'
                        }
                    ];
                rules.title = [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    },
                    {
                        min: 10,
                        message: '标题长度不少于10个字',
                        trigger: 'blur'
                    }
                ]
            }
            return {
                formModel: {
                    tab: '',
                    title: '',
                    content: ''
                },
                rules,
                configs: {
                    status: false, // 禁用底部状态栏
                    spellChecker: false // 禁用拼写检查
                }
            }
        },
        computed: {
            ...mapState(['token']),
            tabs() {
                var tabArray = cloneDeep(tabs);
                tabArray.pop();
                return tabArray;
            },
            containerType() {
                if (this.type === 'post') {
                    return 'index-editor-container';
                } else if (this.type === 'replyLevel') {
                    return 'reply-editor-container';
                }
                return '';
            },
            isLogin() {
                return !!this.token;
            }
        },
        methods: {
            submit(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    } else {
                        this.post();
                    }
                })
            },
            post() {
                var ctx = this;
                this.$emit('post', {
                    title: ctx.formModel.title,
                    tab: ctx.formModel.tab,
                    content: ctx.formModel.content,
                    reply: ctx.reply
                });
                this.formModel.content = '';
            }
        },
        created() {
            this.formModel.title = this.title;
            this.formModel.select = this.tab;
            this.formModel.content = this.content;
        }
    }
</script>

<style lang="scss">
    @import "../style/assist/variable";
    @import '~simplemde/dist/simplemde.min.css';
    
    .CodeMirror .cm-spell-error:not(.cm-url):not(.cm-comment):not(.cm-tag):not(.cm-word) {
        background: none;
    }
    .markdown-editor {
        margin-top: 0;
    }
    .editor-container {
        padding-bottom: 15px;
        h3 {
            font-size: 20px;
            font-weight: bold;
        }
        .CodeMirror {
            min-height: 0;
            height: 400px;
            font-size: 14px; 
        }
        .not-login-tips {
            padding-top: 10px;
            a {
                color: $linkColor;
            }
        }
        .el-select {
            margin-top: 15px;
        }
    }
    .index-editor-container {
        margin: 0 30px;
        padding-top: 10px;
    }
    .reply-editor-container {
        .CodeMirror {
            height: 200px;
        }
    }
</style>
