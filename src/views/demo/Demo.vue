<template>
<div></div>
</template>

<script>
import axios from 'axios'; 
export default {
    created() {
        axios.post('https://www.iyingdi.cn/hearthstone/unpack', {
            series:13,
            size:60
        })
        .then(function(res) {
            console.log(res);
        })
    }
 }
</script>