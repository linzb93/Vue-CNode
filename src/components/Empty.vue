<template>
    <div class="empty-tips">
        <img src="@/assets/images/" alt="">
        <p>暂无内容</p>
    </div>
</template>

<script>
    export default {
        name: 'EmptyTips'
    };
</script>

<style lang="scss">
    .empty-tips {
        text-align: center;
        padding-top: 20px;
        p {
            color: #666;
            font-size: 14px;
            margin-top: 14px;
        }
    }
</style>
