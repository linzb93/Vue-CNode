<template>
    <transition name="fade">
        <div class="back-to-top" @click="backToTop" v-show="show">
            <i class="fa fa-chevron-up" aria-hidden="true"></i>
        </div>
    </transition>
</template>

<script>
    import throttle from 'lodash/throttle';
    import { isIE } from '@/utils';

    var element = isIE() ? document.body : document.documentElement;

    export default {
        name: 'ToTop',
        data() {
            return {
                show: false
            }
        },
        methods: {
            backToTop() {
                element.scrollTop = 0;
            }
        },
        created() {
            var ctx = this;
            window.onscroll = throttle(function() {
                ctx.show = element.scrollTop > 300;
            }, 300);
        }
    }
</script>

<style lang="scss"> 

    .back-to-top {
        cursor: pointer;
        position: fixed;
        right: 0;
        bottom: 120px;
        width: 60px;
        height: 60px;
        border: 1px solid #bbb;
        font-size: 40px;
        color: #bbb;
        text-align: center;
        background: #fff;
        &::before {
            margin-top: 10px;
        }
    }
</style>

