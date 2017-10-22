<template>
<el-form>
    <el-form-item label="订阅指标表是否显示索引号">
  <el-switch
    v-model="config.subscriptionsOption.defaultShowIndex"
    on-color="#13ce66"
    off-color="#ff4949">
    </el-switch>
 </el-form-item>
</el-form>
</template>

<script>
export default {
   data () {
     return {
       config: {
	   	  subscriptionsOption: {
		  	defaultShowDay: 10,
			defaultShowIndex: true,
			tableShowOption: {
			  statisticsOption: [ ],
			  moreOption: [ ],
			  otherOption: [ ]
			}
		  }
       }
     }
   }
 }
</script>