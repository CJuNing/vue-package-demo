<template>
  <div id="app">
      <!-- <Msite /> -->
      <Demo />
  </div>
</template>

<script>
//禁用路由
import Msite from '@/components/Msite'
import Demo from '@/components/demo'
export default {
  components:{
    Demo
  },
  name: 'app', 
}
</script>

<style lang="less" ref="stylesheet/less" >
#app{
  width: 100%;
  height: 100%;
}
</style>
