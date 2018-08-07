<!--导航条组件-->
<template>
  <div class="navbar">
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left" @click="open = !open">
        <mu-icon value="menu" ></mu-icon>
      </mu-button>
        Blog

      <!--右侧登录按钮-->
      <mu-menu slot="right" :open.sync="menuOpen">
        <mu-button flat @click="isLogin?openLogin:openLogin = !openLogin">
          {{btnName}}
        </mu-button>
        <mu-list slot="content" v-show="isLogin">
          <mu-list-item button to="my-articles" @click="menuOpen = !menuOpen">
            <mu-list-item-content>
              <mu-list-item-title>MangeArticles</mu-list-item-title>
            </mu-list-item-content>
          </mu-list-item>
          <mu-list-item button @click="logOut">
            <mu-list-item-content>
              <mu-list-item-title>LogOut</mu-list-item-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-menu>
    </mu-appbar>

    <!--左侧抽屉导航栏-->
    <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'">
      <mu-list>
        <mu-list-item button @click="jumpToHome">
          <mu-list-item-title>首页</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="jumpToChips">
          <mu-list-item-title>标签云</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="open = false">
          <mu-list-item-title >Close</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>

    <!--登录页-->
    <mu-dialog title="登录" width="460" :open.sync="openLogin">
      <mu-container>
        <mu-form ref="formLogin" :model="validateLoginForm" class="mu-demo-form">
          <mu-form-item label="账号" prop="username" :rules="usernameLoginRules">
            <mu-text-field v-model="validateLoginForm.username" prop="username"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="密码" prop="password" :rules="passwordLoginRules">
            <mu-text-field type="password" v-model="validateLoginForm.password" prop="password"></mu-text-field>
          </mu-form-item>
          <mu-form-item>
            <mu-button color="primary" @click="submitLogin">登录</mu-button>
            <mu-button @click="clearLogin">重置</mu-button>
            <mu-button color="success" @click="jumpToReg">注册</mu-button>
          </mu-form-item>
        </mu-form>
      </mu-container>
    </mu-dialog>

    <!--注册页-->
    <mu-dialog title="注册" width="460" :open.sync="openRegister">
      <mu-container>
        <mu-form ref="formRegister" :model="validateRegisterForm" class="mu-demo-form">
          <mu-form-item label="账号" prop="username" :rules="usernameRegisterRules">
            <mu-text-field v-model="validateRegisterForm.username" prop="username"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="用户名" prop="nickname" :rules="nicknameRegisterRules">
            <mu-text-field v-model="validateRegisterForm.nickname" prop="nickname"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="密码" prop="password" :rules="passwordRegisterRules">
            <mu-text-field type="password" v-model="validateRegisterForm.password" prop="password"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="请确认密码" prop="passwordConfirm" :rules="passwordConfirmRegisterRules">
            <mu-text-field type="password" v-model="validateRegisterForm.passwordConfirm"  prop="passwordConfirm"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="isAgree" :rules="argeeRegisterRules">
            <mu-checkbox label="本站仅限人类及猫注册使用" v-model="validateRegisterForm.isAgree"></mu-checkbox>
          </mu-form-item>
          <mu-form-item>
            <mu-button color="success" @click="submitRegister">注册</mu-button>
            <mu-button @click="clearRegister">重置</mu-button>
            <mu-button color="primary" @click="jumpToLog">登录</mu-button>
          </mu-form-item>
        </mu-form>
      </mu-container>
    </mu-dialog>

    <mu-snackbar position="top" :open.sync="tip.open" :color="tip.color">
      <mu-icon left :value="tip.icon"></mu-icon>
      {{tip.message}}
      <mu-button flat slot="action" color="#fff" @click="tip.open = false">Close</mu-button>
    </mu-snackbar>

  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
export default {
  data () {
    return {
      docked: false,
      open: false,
      menuOpen: false,
      position: 'left',
      openLogin: false,
      openRegister: false,
      btnName: "LOGIN",
      tip: {
        open: false,
        message: '',
        color: 'success',
        icon: 'check_circle',
        timeout: 3000
      },
      usernameRegisterRules: [
        { validate: (val) => !!val, message: '账号不能为空'},
        { validate: (val) => val.length >= 3 && val.length <= 15, message: '账号长度大于3小于15'}
      ],
      nicknameRegisterRules: [
        { validate: (val) => !!val, message: '用户名不能为空'},
        { validate: (val) => val.length >= 3 && val.length <= 15, message: '用户名长度大于3小于15'}
      ],
      passwordRegisterRules: [
        { validate: (val) => !!val, message: '密码不能为空'},
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      passwordConfirmRegisterRules: [
        { validate: (val) => !!val, message: '密码不能为空'},
        { validate: (val) => val==this.validateRegisterForm.password, message: '与之前密码输入不一致'}
      ],
      argeeRegisterRules: [{ validate: (val) => !!val, message: '请确认用户须知'}],
      validateRegisterForm: {
        username: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
        isAgree: false
      },usernameLoginRules: [
        { validate: (val) => !!val, message: '账号不能为空'},
        { validate: (val) => val.length >= 3 && val.length <= 15, message: '账号长度大于3小于15'}
      ],
      passwordLoginRules: [
        { validate: (val) => !!val, message: '密码不能为空'},
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      validateLoginForm: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    username(){
      return this.$store.state.username;
    },
    nickname(){
      return this.$store.state.nickname;
    },
    isLogin(){
      return this.$store.state.isLogin;
    }
  },
  methods: {
    clearLogin () {
      this.validateLoginForm = {
        username: '',
        password: '',
      };
    },
    clearRegister () {
      this.validateRegisterForm = {
        username: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
        isAgree: false
      };
    },
    jumpToReg () {
      this.openLogin = false;
      this.openRegister = true;
    },
    jumpToLog () {
      this.openLogin = true;
      this.openRegister = false;
    },
    jumpToChips () {
      this.$router.push({ path: '/chips'});
      this.open = false;
    },
    submitLogin () {
      this.$refs.formLogin.validate().then((result) => {
        if(result === true){
          axios.post('/api/user/login',{
            username: this.validateLoginForm.username,
            password: this.validateLoginForm.password
          }).then((response)=>{
            let res = response.data;
            if (res.status==="200"){
              console.log("登录成功");
              this.openTip('success','登录成功','check_circle');
              this.$store.commit('updateIsLogin',true);
              this.$store.commit('updateUserName',res.result.username);
              this.$store.commit('updateNickName',res.result.nickname);
              this.btnName = res.result.nickname;
              this.validateRegisterForm.username=res.result.username;
              this.validateRegisterForm.nickname=res.result.nickname;
              this.openLogin = false;
              this.clearLogin();
              console.log(res.result.username);
            }else if (res.status==="500"){
              console.log("登录失败");
              this.errorTextRegister = "登录失败";
              this.openTip('error','我的天！账号或密码错误','warning');
            }else if (res.status==="600"){
              console.log("登录失败");
              this.errorTextRegister = "登录失败";
              this.openTip('error','账号不存在???','warning');
            }
          })
        }
      }).catch((err)=>{

      });
    },
    submitRegister () {
      this.$refs.formRegister.validate().then((result) => {
        if(result == true){
          axios.post('/api/user/register',{
            username: this.validateRegisterForm.username,
            nickname: this.validateRegisterForm.nickname,
            password: this.validateRegisterForm.password
          }).then((response)=>{
                let res = response.data;
                if (res.status==="200"){
                  console.log("注册成功");
                  this.openTip('success','注册成功','check_circle');
                  this.jumpToLog();
                  this.validateLoginForm.username=this.validateRegisterForm.username;
                  this.validateLoginForm.password=this.validateRegisterForm.password;
                  this.clearRegister ();
                }else if (res.status==="300"){
                  console.log("用户名已被占用");
                  this.errorTextRegister = "账号已被占用";
                  this.openTip('error','我的天！账号已被占用','warning');
              }
              }
            ).catch(err=>{
                console.log(err)
                console.log("注册失败");
          });
        }
      });
    },
    openTip(color,message,icon){
      this.tip.color = color;
      this.tip.message = message;
      this.tip.icon = icon;
      if(this.tip.timer)clearTimeout(this.tip.timer);
      this.tip.open = true;
      this.tip.timer = setTimeout(()=>{
        this.tip.open = false;
      },this.tip.timeout);
    },
    jumpToMyArticles(){
      this.$router.push({path:'/my-atricles'});
    },
    jumpToHome(){
      this.$router.push({path:'/home'});
      this.open = false;
    },
    logOut(){
      axios.post('/api/user/logout').then((response)=>{
        let res = response.data;
        if (res.status==="200"){
          console.log("登出成功");
          this.openTip('success','登出成功','check_circle');
          this.$store.commit('updateIsLogin',false);
          this.$store.commit('updateUserName','');
          this.$store.commit('updateNickName','');
          this.btnName = "LOGIN";
          this.$router.push("/home");
          this.clearRegister ();
          this.clearLogin();
        }else if (res.status==="500"){
          console.log("当前未登录");
        }
      })
    }

  },mounted(){
    axios.get('/api/user/checkLogin').then((response)=>{
        let res = response.data;
        if (res.status==="200"){
          console.log("返回登录信息成功");
          this.$store.commit('updateIsLogin',true);
          this.$store.commit('updateUserName',res.result.username);
          this.$store.commit('updateNickName',res.result.nickname);
          this.btnName = res.result.nickname;
          console.log(this.btnName);
        }else if (res.status==="500"){
          console.log("当前未登录");
        }
      }
    ).catch(err=>{
      console.log(err)
      console.log("返回失败失败");
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar{
  margin-bottom: 16px;
}
</style>
