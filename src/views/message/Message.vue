<template>
    <main>
        <div class="message-container wrapper">
            <div class="message"></div>
        </div>
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import EmptyTips from '@/components/Empty';
    import { getAllMsg, markAllMsgRead, markOneMsgRead } from '@/service';

    export default {
        name: 'Message',
        components: {
            EmptyTips
        },
        data() {
            return {}
        },
        computed: {
            ...mapState(['token'])
        },
        methods: {
            render() {
                this.getAllMsg(this.token)
                .then(res => {});
            },
            markAllMsgRead() {},
            markOneMsgRead() {}
        },
        created() {
            getAllMsg(this.token)
            .then(res => {
                console.log(res.data);
            });
        }
    }
</script>

<style lang="scss">
    @import "../../style/assist/mixin";
    
    .message-container {}
</style>
