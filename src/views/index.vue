<!--首页View-->
<template>
  <div>
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import navBar from "@/components/NavBar";

    export default {
      name: "index",
      data () {
        return{
        }
      },
      components:{
        navBar
      }
    }
</script>

<style scoped>

</style>
