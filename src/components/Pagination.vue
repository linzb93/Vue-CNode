<template>
    <div class="pagination">
        <a href="javascript:;" @click="switchPrev" v-show="!isFirstPage">上一页</a>
        <a href="javascript:;" @click="switchNext" v-show="!isLastPage">下一页</a>        
    </div>
</template>

<script>
    export default {
        name: 'Pagination',
        props: ['isLastPage'],
        data() {
            return {
                curPage: 1,
                isFirstPage: true
            }
        },
        methods: {
            switchPrev() {
                this.curPage--;
                if (this.curPage === 1) {
                    this.isFirstPage = true;
                }
                this.$emit('change', this.curPage);
            },
            switchNext() {
                this.curPage++;
                this.isFirstPage = false;
                this.$emit('change', this.curPage);
            }
        }
    };
</script>

<style lang="scss">
    .pagination {
        margin: 20px 0 0 20px;
        padding-bottom: 10px;
        a {
            color: #21a9de;
            margin: 0 5px;
        }
    }
</style>
