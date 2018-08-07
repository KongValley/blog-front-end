import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  //定义状态
  state:{
    username:'',
    nickname:'',
    isLogin: false
  },
  mutations:{
    updateIsLogin(state,isLogin){
      state.isLogin = isLogin;
      localStorage.setItem("isLogin",isLogin);
    },
    updateUserName(state,username){
      state.userName = username;
    },
    updateNickName(state,nickname){
      state.nickName = nickname;
    }
  }
})

export default store;
