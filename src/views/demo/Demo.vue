<template>
    <div class="com">
        {{id}}
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'Demo',
        data() {
            return  {
                id: 3
            }
        },
        created() {
            axios.get('/getUser')
            .then(res => {
                console.log(res);
            })
        }
    }
</script>