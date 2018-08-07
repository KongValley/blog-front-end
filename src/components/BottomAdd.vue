<template>
  <div>
    <mu-button large fab color="red" class="button-wrapper" v-show="isLogin" to="add" @click="openClose">
        <mu-icon value="edit" ></mu-icon>
    </mu-button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      open: false
    }
  },
  computed: {
    isLogin(){
      return this.$store.state.isLogin;
    }
  },methods: {
    openClose(){
      this.open = false;
    }
  }
}
</script>

<style scoped>
.button-wrapper{
  position: fixed;
  right: 16px;
  bottom: 16px;
}
a{
  text-decoration: none;
}
</style>


