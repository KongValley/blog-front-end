<template id="my-atricles">
  <div>
    <mu-container>
      <mu-paper :z-depth="0" >
        <mu-data-table border :columns="columns" :sort.sync="sort" @sort-change="handleSortChange" :data="list">
          <template slot-scope="scope">
            <td class="is-center">{{scope.row.title}}</td>
            <td class="is-center">{{scope.row.create_at_string}}</td>
            <td class="is-center">{{scope.row.update_at_string}}</td>
            <td class="is-center">{{scope.row.chipsStr}}</td>
            <td class="is-center">
              <mu-flex align-items="center" justify-content="center">
                <mu-button flat color="primary" :to="{ name: 'EditArticle', params: { id:scope.row._id }}" >Edit</mu-button>
                <mu-button flat color="error" @click="deleteArticles(scope.$index)">Delete</mu-button>
              </mu-flex>
            </td>
          </template>
        </mu-data-table>
      </mu-paper>
    </mu-container>
    <bottom-add></bottom-add>
    <mu-container class="page-content">
      <mu-flex justify-content="center">
        <mu-pagination raised circle :total="total" :current.sync="current" :page-size="9" @change="queryByCurrent"></mu-pagination>
      </mu-flex>
    </mu-container>

    <mu-snackbar position="top" :open.sync="tip.open" :color="tip.color">
      <mu-icon left :value="tip.icon"></mu-icon>
      {{tip.message}}
      <mu-button flat slot="action" color="#fff" @click="tip.open = false">Close</mu-button>
    </mu-snackbar>

  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import moment from 'moment'
  moment.locale('zh-cn');
  import bottomAdd from "@/components/BottomAdd"
  export default {
      name: "MyArticles",
      data() {
        return {
          total: 1,
          current:1,
          username: '',
          nickname: '',
          sort: {
            name: '',
            order: 'asc'
          },
          tip: {
            open: false,
            message: '',
            color: 'success',
            icon: 'check_circle',
            timeout: 1000
          },
          columns: [
            { title: '文章标题', width: 225, name: 'title',align: 'center', sortable: true },
            { title: '创建时间', name: 'create_at_string', width: 200, align: 'center', sortable: true },
            { title: '上次更新时间', name: 'update_at_string', width: 200, align: 'center', sortable: true },
            { title: '标签', name: 'chipsStr', width: 225, align: 'center'},
            { title: '操作', name: 'handle', width: 270, align: 'center'}
          ],
          list: []
        };
      },
      components:{
        bottomAdd
      },methods: {
        handleSortChange ({name, order}) {
          this.list = this.list.sort((a, b) => order === 'asc' ? a[name] - b[name] : b[name] - a[name]);
        },
        queryNumber(){
          axios.post('/api/articles/queryAllMyArticlesNumber',{
            username: this.username,
          }).then((response)=>{
              let res = response.data;
              if (res.status==="200"){
                console.log("返回文章信息成功");
                console.log(res.result);
                this.total = res.result;
                console.log(this.total);
                this.queryByCurrent();
              }else if (res.status==="500"){
                console.log("当前未登录");
              }
            }
          ).catch(err=>{
            console.log(err);
            console.log("返回失败");
          });
        },
        queryByCurrent(){
          axios.post('/api/articles/queryAllMyArticles',{
            username: this.username,
            current: this.current
          }).then((response)=>{
              let res = response.data;
              if (res.status==="200"){
                console.log("返回文章信息成功");
                console.log(res.result);
                res.result.forEach(function (item) {
                  item.create_at_string = moment(item.createdAt).calendar();
                  item.update_at_string = moment(item.updatedAt).calendar();
                  item.chipsStr = item.chips.join(',');
                });
                this.list = res.result;
              }else if (res.status==="500"){
                console.log("当前未登录");
              }
            }
          ).catch(err=>{
            console.log(err);
            console.log("返回失败");
          });
        },
        deleteArticles:function(index){
          const id = this.list[index]._id;
          axios.post('/api/articles/delteMyArticle',{
            id: id
          }).then((response)=>{
              let res = response.data;
              if (res.status==="200"){
                console.log("删除文章成功");
                console.log(res.result);
                this.queryNumber();
                this.openTip('success','删除成功','check_circle');
              }else if (res.status==="500"){
                console.log("当前未登录");
              }
            }
          ).catch(err=>{
            console.log(err);
            console.log("返回失败");
          });
        },
        editArticles:function(index){
          const id = this.list[index]._id;

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
        }
      },
      mounted(){
        axios.get('/api/user/checkLogin').then((response)=>{
            let res = response.data;
            if (res.status==="200"){
              console.log("返回登录信息成功");
              this.$store.commit('updateIsLogin',true);
              this.$store.commit('updateUserName',res.result.username);
              this.$store.commit('updateNickName',res.result.nickname);
              this.username = res.result.username;
              this.nickname = res.result.nickname;
              this.queryNumber();
            }else if (res.status==="500"){
              console.log("当前未登录");
            }
          }
        ).catch(err=>{
          console.log(err)
          console.log("返回失败");
        });
      }
    }
</script>

<style scoped>
.page-content{
  margin-top: 20px;
}
</style>
