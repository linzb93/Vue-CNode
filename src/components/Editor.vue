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
        <vue-editor v-model="content"></vue-editor>
        <el-button type="primary" @click="post">提交</el-button>
    </div>
</template>

<script>
    import { VueEditor } from 'vue2-editor';
    import { mapState } from 'vuex';

    export default {
        name: 'Editor',
        components: {
            VueEditor
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
                content: ''
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
            }
        }
    }
</script>

<style lang="scss">
    @import "../style/assist/variable";
    
    .editor-container {
        margin-top: 10px;
        padding-bottom: 15px;
        h3 {
            font-size: 20px;
            font-weight: bold;
        }
        #quill-container {
            font-size: 14px;
            .ql-editor a {
                text-decoration: none;
                color: $linkColor;
            }
        }
        .el-select {
            margin-top: 15px;
        }
        .el-input {
            margin-top: 15px;
        }
        .quillWrapper {
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
        #quill-container {
            height: 200px;
        }
    }
</style>
