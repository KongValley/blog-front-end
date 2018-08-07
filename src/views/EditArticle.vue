<template>
  <div>
    <mu-container>
      <mu-card style="width: 100%;margin-top: 20px;margin-bottom: 20px;" :z-depth="0">
        <div>
          <mu-appbar style="width: 100%;" color="#fff" :z-depth="0">
            <mu-text-field v-model="title" placeholder="标题最多不超过10个字符" :max-length="10"
                           style="font-size: 18px; font-weight: 400;"></mu-text-field>
            <mu-text-field v-model="chip" placeholder="请输入标签" :max-length="10"
                           style="font-size: 18px; font-weight: 400; margin-left: 50px;width: 10%"
                           @keyup.enter="createChip"></mu-text-field>
            <mu-chip v-for="(chip, index) in chips" :key="chip" color="primary" @delete="remove(index)" delete style="margin-top: 20px;margin-left: 5px">{{chip}}</mu-chip>
          </mu-appbar>
          <mu-appbar style="width: 100%;" color="#fff" :z-depth="0">
            <mu-text-field v-model="about" placeholder="输入文字概述最多不超过40个字符" :max-length="40"
                           style="font-size: 18px; font-weight: 400;width: 80%"></mu-text-field>
          </mu-appbar>
          <mavon-editor ref=md @imgAdd="$imgAdd" v-model="content"/>
        </div>
      </mu-card>
    </mu-container>

    <mu-button large fab color="green" class="button-wrapper" @click="saveArticles">
      <mu-icon value="save" ></mu-icon>
    </mu-button>

    <mu-snackbar position="top" :open.sync="tip.open" :color="tip.color">
      <mu-icon left :value="tip.icon"></mu-icon>
      {{tip.message}}
      <mu-button flat slot="action" color="#fff" @click="tip.open = false">Close</mu-button>
    </mu-snackbar>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from "axios"
    export default {
        name: "EditArticles",
        data() {
            return {
              userInfo:{
                username: '',
                nickname: ''
              },
              content: '',
              title: '',
              about: '',
              chip: '',
              chips: [],
              tip: {
                open: false,
                message: '',
                color: 'success',
                icon: 'check_circle',
                timeout: 1000
              }
            }
        },
        computed: {
          username(){
            return this.$store.state.username;
          },
          nickname(){
            return this.$store.state.nickname;
          }
        },
        methods: {
          createChip(){
            this.chips.push(this.chip);
            this.chip = '';
          },
          remove (index) {
            this.chips.splice(index, 1);
          },
          $imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
            var formdata = new FormData();
            formdata.append('image', $file);
            axios({
              url: '/api/supload',
              method: 'post',
              data: formdata,
              anync:true,
              contentType:false,
              processData:false,
              headers: { 'Content-Type': 'multipart/form-data' },
            }).then((url) => {
              let realurl = "http://localhost:3000/img/"+url.data.url;
              // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
              /**
               * $vm 指为mavonEditor实例，可以通过如下两种方式获取
               * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
               * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
               */
              this.$refs.md.$img2Url(pos, realurl);
              console.log(realurl);
            })
          },
          saveArticles(){
            const id = this.$route.params.id;
            axios.post('/api/articles/update',{
              id: id,
              username: this.userInfo.username,
              nickname: this.userInfo.nickname,
              title: this.title,
              content: this.content,
              chips: this.chips,
              about: this.about
            }).then((response)=>{
                let res = response.data;
                if(res.status === "200"){
                  this.title = '';
                  this.content = '';
                  this.chips = [];
                  this.about = '';
                  this.openTip('success','保存成功','check_circle');
                  this.$router.push({ path: '/my-articles'});
                }
            }).catch(err => {

            })
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
          queryById(id){
            axios.post('/api/articles/queryOneArticle',{
              id: id
            }).then((response)=>{
                let res = response.data;
                if (res.status==="200"){
                  console.log("返回文章信息成功");
                  console.log(res.result);
                  // res.result.forEach(function (item) {
                  //   item.update_at_string = moment(item.updateAt).format('YYYY-MM-DD');
                  // });
                  this.title = res.result.title;
                  this.about = res.result.about;
                  this.content = res.result.content;
                  this.chips = res.result.chips;
                }else if (res.status==="500"){
                  console.log("返回失败");
                }
              }
            ).catch(err=>{
              console.log(err);
              console.log("返回失败");
            });
          }
        },mounted(){
          const id = this.$route.params.id;
          axios.get('/api/user/checkLogin').then((response)=>{
            let res = response.data;
            if (res.status==="200"){
              console.log("返回登录信息成功");
              this.userInfo.username = res.result.username;
              this.userInfo.nickname = res.result.nickname;
              this.queryById(id);
            }else if (res.status==="500"){
              console.log("当前未登录");
            }
          }).catch(err=>{
            console.log(err)
            console.log("返回失败失败");
          });
        }
    }
</script>

<style scoped>
  .button-wrapper{
    position: fixed;
    right: 16px;
    bottom: 16px;
  }
</style>
