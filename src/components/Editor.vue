<template>
    <div :class="['editor-container', containerType]">
        <h3>{{title}}</h3>
        <el-select
        v-model="selectValue"
        v-if="type === 'post'"
         placeholder="请选择">
            <el-option
            v-for="item in tabs"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
        <el-input v-if="type === 'post'" placeholder="标题长度不少于10个字" v-model="titleValue"/>
        <markdown-editor v-model="content" :configs="configs"></markdown-editor>
        <el-button type="primary" @click="post">提交</el-button>
    </div>
</template>

<script>
    import MarkdownEditor from 'vue-simplemde/src/markdown-editor';
    import { mapState } from 'vuex';
    import simpleMDE from 'simplemde';

    export default {
        name: 'Editor',
        components: {
            MarkdownEditor
        },
        props: {
            title: {
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
            }
        },
        data() {
            return {
                selectValue: '',
                titleValue: '',
                content: '',
                configs: {
                    status: false, // 禁用底部状态栏
                    spellChecker: false // 禁用拼写检查
                }
            }
        },
        computed: {
            ...mapState(['tabs']),
            containerType() {
                if (this.type === 'post') {
                    return 'index-editor-container';
                } else if (this.type === 'replyLevel') {
                    return 'reply-editor-container';
                }
                return '';
            }
        },
        methods: {
            post() {
                var ctx = this;
                if (this.content === '') {
                    this.$message({
                        type: 'error',
                        message: '内容不能为空'
                    });
                    return;
                }
                this.$emit('post', {
                    title: ctx.titleValue,
                    tab: ctx.selectValue,
                    content: ctx.content,
                    reply: ctx.reply
                });
                this.content = '';
            }
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
        margin-top: 15px;
    }
    .editor-container {
        margin-top: 10px;
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
        .el-select {
            margin-top: 15px;
        }
        .el-input {
            margin-top: 15px;
        }
        .el-button {
            margin-top: 15px;
        }
    }
    .index-editor-container {
        margin: 10px 30px 0;
    }
    .reply-editor-container {
        .CodeMirror {
            height: 200px;
        }
    }
</style>
