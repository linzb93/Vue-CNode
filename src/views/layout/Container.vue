<template>
    <main>
        <div class="line-scale" v-if="!loaded">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <slot v-else></slot>
    </main>
</template>

<script>
    export default {
        name: 'Container',
        props: ['load', 'errorMsg'],
        data() {
            return {
                loaded: false
            }
        },
        watch: {
            load(value) {
                var ctx = this;
                this.loaded = true;
                if (value === 'error') {
                    this.$message({
                        type: 'error',
                        message: ctx.errorMsg,
                        onClose() {
                            if (ctx.errorMsg === '请先登录') {
                                ctx.$router.push('/login');
                                return;
                            }
                            ctx.$router.push('/');
                        }
                    });
                }
            }
        }
    };
</script>

<style lang="scss">
    @function delay($interval, $count, $index) {
        @return ($index * $interval) - ($interval * $count);
    }
    @keyframes line-scale {
        0% {
            transform: scaley(1.0);
        }
        50% {
            transform: scaley(0.4);
        }
        100% {
            transform: scaley(1.0);
        }
    }

    @mixin line-scale($n:5) {
        @for $i from 1 through $n {
            > div:nth-child(#{$i}) {
            animation: line-scale 1s delay(0.1s, $n, $i) infinite cubic-bezier(.2,.68,.18,1.08);
            }
        }
    }

    .line-scale {
        @include line-scale();
        width: 90px;
        margin: 0 auto;
        > div {
            background-color: #fff;
            width: 4px;
            height: 35px;
            border-radius: 2px;
            margin: 2px;
            animation-fill-mode: both;
            display: inline-block;
        }
    }
</style>
