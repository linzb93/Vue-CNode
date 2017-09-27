<template>
    <div id="app">
        <router-view name="header"></router-view>
        <router-view name="main"></router-view>
    </div>
</template>

<script>
    import '@/style/style.scss';
    import { ls } from '@/utils/store';
    import { tokenValidate } from '@/service';

    export default {
        name: 'app',
        beforeCreate() {
            if (ls.store('token')) {
                var token = ls.store('token');
                this.$store.commit('SAVE_TOKEN', token);
                tokenValidate(token)
                .then(res => {
                    var data = res.data;
                    this.$store.commit('SAVE_INFO', {
                        name: data.loginname,
                        id: data.id,
                        avatar: data.avatar_url
                    });
                })
            }
        }
    };
</script>
