<template>
  <div>
    <mu-container>
      <mu-paper :z-depth="1" style="min-width: 100%;margin-bottom: 20px;margin-top: 30px;" >
        <div>
          <mu-appbar style="width: 100%;" :z-depth="z_depth">
            {{articleInfo.title}}
            <mu-chip v-for="(chip, index) in articleInfo.chips" :key="chip" :color="colors[index%6+1]" style="margin-left: 5px;">{{chip}}</mu-chip>
          </mu-appbar>
          <mu-paper :z-depth="z_depth" style="padding:10px 40px;background-color: #f5f5f5;font-size: 24px;font-weight: 400;">
            简介
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px 35px;background-color: #f5f5f5;font-size: 18px">
            {{articleInfo.about}}
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px 40px;background-color: #f5f5f5;font-size: 24px;font-weight: 400">
            正文
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px 40px;background-color: #f5f5f5">
            <dl v-html="articleInfo.content_html"></dl>
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px 40px;background-color: #f5f5f5;font-size: 16px;font-weight: 400">
            作者：{{articleInfo.nickname}}
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px 40px;background-color: #f5f5f5;font-size: 16px;font-weight: 400">
            创建于：{{articleInfo.create_at_string}}，更新于：{{articleInfo.update_at_string}}
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px;background-color: #f5f5f5">
            <div style="margin: auto;width: 200px">
              <mu-button icon color="red" @click="thumbUpCheck">
                <mu-icon value="thumb_up" style="margin-right: 10px">
                </mu-icon>
                {{articleInfo.thumb_up}}
              </mu-button>
              <mu-button icon color="red" style="margin-left: 100px" @click="thumbDownCheck">
                <mu-icon value="thumb_down" style="margin-right: 10px"></mu-icon>
                {{articleInfo.thumb_down}}
              </mu-button>
            </div>
          </mu-paper>

          <mu-paper :z-depth="z_depth" style="padding:10px;background-color: #f5f5f5;">
            <mu-text-field v-model="message" multi-line :rows="4" icon="comment"  placeholder="输入留言" full-width></mu-text-field>
            <mu-flex justify-content="end" >
              <mu-button color="primary" style="margin-right: 20px" @click="sendComment">
                Send
                <mu-icon right value="send" ></mu-icon>
              </mu-button>
            </mu-flex>
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px 40px;background-color: #f5f5f5;font-size: 24px;font-weight: 400">
            留言
          </mu-paper>
          <mu-paper :z-depth="z_depth" style="padding:10px 30px;background-color: #f5f5f5;font-size: 24px;font-weight: 400" v-for="(comment) in comments" :key="comment._id">

            <mu-flex>
              <mu-card-header :title="comment.nickname" :sub-title="comment.time" style="width: 20%">
                <mu-avatar slot="avatar">
                  {{comment.nickname.substring(0, 1)}}
                </mu-avatar>
              </mu-card-header>
              <mu-card-text  style="width:75%;word-break: break-word;font-size: 18px">{{comment.content}}</mu-card-text>
            </mu-flex>


          </mu-paper>
        </div>
      </mu-paper>
    </mu-container>

    <mu-snackbar position="top" :open.sync="tip.open" :color="tip.color">
      <mu-icon left :value="tip.icon"></mu-icon>
      {{tip.message}}
      <mu-button flat slot="action" color="#fff" @click="tip.open = false">Close</mu-button>
    </mu-snackbar>
  </div>
</template>

<script type="text/ecmascript-6">
  import marked from 'marked';
  import axios from 'axios';
  import moment from 'moment';
    export default {
        name: "ArticleDetails",
        data() {
            return {
              username: '',
              nickname: '',
              message: '',
              z_depth: 0,
              colors: ['secondary', 'primary', 'success', 'warning', 'info', 'error'],
              articleInfo: {
              },
              tip: {
                open: false,
                message: '',
                color: 'success',
                icon: 'check_circle',
                timeout: 1000
              },
              comments:[],
            }
        },
        methods:{
          checkLogin:function(){
            axios.get('/api/user/checkLogin').then((response)=>{
                let res = response.data;
                if (res.status==="200"){
                  console.log("返回登录信息成功");
                  this.$store.commit('updateIsLogin',true);
                  this.$store.commit('updateUserName',res.result.username);
                  this.$store.commit('updateNickName',res.result.nickname);
                  this.username = res.result.username;
                  this.nickname = res.result.nickname;
                }else if (res.status==="500"){
                  console.log("当前未登录");
                }
              }
            ).catch(err=>{
              console.log(err)
              console.log("返回失败");
            });
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
                  this.articleInfo = res.result;
                  this.articleInfo.update_at_string = moment(this.articleInfo.updatedAt).calendar();
                  this.articleInfo.create_at_string = moment(this.articleInfo.createdAt).calendar();
                  this.articleInfo.thumb_up = this.articleInfo.thumbUp.length;
                  this.articleInfo.thumb_down = this.articleInfo.thumbDown.length;
                  this.articleInfo.content_html_before = marked(this.articleInfo.content);
                  this.comments = this.articleInfo.comment;
                  //给所有img标签添加width="90%",height="90%"防止超出paper大小
                  var reg = new RegExp('alt',"g");

                  this.articleInfo.content_html =this.articleInfo.content_html_before.replace(reg,"width=\"90%\" height=\"90%\ alt");
                  this.checkLogin();
                }else if (res.status==="500"){
                  console.log("返回失败");
                }
              }
            ).catch(err=>{
              console.log(err);
              console.log("返回失败");
            });
          },
          thumbUpPost:function (flag) {
            const id = this.$route.params.id;
            axios.post('/api/articles/thumbUp',{
              id: id,
              username: this.username,
              flag: flag
            }).then((response)=>{
                let res = response.data;
                if (res.status==="200"){
                  console.log("点赞取赞成功");
                  console.log(res.msg);
                  this.articleInfo.thumbUp = res.result;
                  this.articleInfo.thumb_up = this.articleInfo.thumbUp.length;

                }else if (res.status==="500"){
                  console.log("点赞取赞失败");
                }
              }
            ).catch(err=>{
              console.log(err);
              console.log("返回失败");
            });
          },
          thumbDownPost:function (flag) {
            const id = this.$route.params.id;
            axios.post('/api/articles/thumbDown',{
              id: id,
              username: this.username,
              flag: flag
            }).then((response)=>{
                let res = response.data;
                if (res.status==="200"){
                  console.log("踩人取踩成功");
                  this.articleInfo.thumbDown = res.result;
                  this.articleInfo.thumb_down = this.articleInfo.thumbDown.length;
                  console.log(res.msg);
                }else if (res.status==="500"){
                  console.log("踩人取踩失败");
                }
              }
            ).catch(err=>{
              console.log(err);
              console.log("返回失败");
            });
          },
          sendComment:function () {
            const id = this.$route.params.id;
            axios.post('/api/articles/saveComment',{
              id: id,
              nickname: this.nickname,
              content: this.message
            }).then((response)=>{
                let res = response.data;
                if (res.status==="200"){
                  console.log("发表成功");
                  this.comments = res.result;
                  console.log(this.comments);
                  this.message = '';
                  queryById(id);
                }else if (res.status==="500"){
                  console.log("发表失败");
                }
              }
            ).catch(err=>{
              console.log(err);
              console.log("返回失败");
            });
          },
          thumbUpCheck:function () {
              if(this.username==''){
                this.openTip('error','请先登录','warning');
              }else {
                const flag = this.isInThumb(this.articleInfo.thumbUp,this.username);
                if (!flag){
                  this.thumbUpPost(flag);
                  this.openTip('success','点赞成功','check_circle');
                } else {
                  this.thumbUpPost(flag);
                  this.openTip('error','取消点赞','warning');
                }
              }
          },
          thumbDownCheck:function () {
            if(this.username==''){
              this.openTip('error','请先登录','warning');
            }else {
              const flag = this.isInThumb(this.articleInfo.thumbDown,this.username);
              if (!flag){
                this.thumbDownPost(flag);
                this.openTip('success','踩人成功','check_circle');
              } else {
                this.thumbDownPost(flag);
                this.openTip('error','取消踩人','warning');
              }
            }

          },
          //查找数组里是否有该值
          isInThumb(arr,val){
            var str = ","+arr.join(",")+",";
            return str.indexOf(","+val+",")!=-1;
          },
          openTip:function(color,message,icon){
            this.tip.color = color;
            this.tip.message = message;
            this.tip.icon = icon;
            if(this.tip.timer)clearTimeout(this.tip.timer);
            this.tip.open = true;
            this.tip.timer = setTimeout(()=>{
              this.tip.open = false;
            },this.tip.timeout);
          }
        },
        mounted(){
          const id = this.$route.params.id;
          console.log(id);
          this.queryById(id);
        }
    }
</script>

<style scoped>

</style>
