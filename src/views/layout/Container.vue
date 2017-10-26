<template>
    <main>
        <div class="line-scale" v-if="!loaded">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <slot v-else-if="!loadError"></slot>
    </main>
</template>

<script>
    export default {
        name: 'Container',
        props: {
            load: {
                type: String,
                required: true
            },
            errorMsg: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                loaded: false
            }
        },
        computed: {
            loadError() {
                return this.loaded == true && this.load === 'error';
            }
        },
        watch: {
            load(value) {
                if (this.loaded) {
                    return;
                }
                var ctx = this;
                this.loaded = true;
                if (value === 'error') {
                    this.$message({
                        type: 'error',
                        message: ctx.errorMsg,
                        onClose() {
                            if (ctx.errorMsg === '请先登录') {
                                ctx.$store.commit('SWITCH_LOGIN_MODAL', true);
                                return;
                            }
                            ctx.$router.push('/');
                        }
                    });
                }
            }
        },
        created() {
            var ctx = this;
            if (this.load === 'error') {
                this.loaded = true;
                this.$message({
                    type: 'error',
                    message: ctx.errorMsg,
                    onClose() {
                        if (ctx.errorMsg === '请先登录') {
                            ctx.$store.commit('SWITCH_LOGIN_MODAL', true);
                            return;
                        }
                        ctx.$router.push('/');
                    }
                });
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
