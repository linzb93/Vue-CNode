<template>
    <div class="empty-tips">
        <img src="../assets/images/list_empty.png" alt="">
        <p>{{title}}</p>
    </div>
</template>

<script>
    export default {
        name: 'EmptyTips',
        props: {
            title: {
                default() {
                    return '暂无内容';
                }
            }
        }
    };
</script>

<style lang="scss">
    .empty-tips {
        text-align: center;
        padding-top: 20px;
        p {
            color: #666;
            font-size: 18px;
            margin-top: 16px;
        }
    }
</style>
