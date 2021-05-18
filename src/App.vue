<!--
 * @Autor: Foley Fan
 * @Date: 2021-05-14 18:15:40
 * @LastEditTime: 2021-05-18 11:04:09
 * @Description: 
-->
<template>
  <div id="app">
    <el-page-table class="el-page-table" :columns="columns"  />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      columns: [{
        label: '列表',
        prop: 'ss'
      }]
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
