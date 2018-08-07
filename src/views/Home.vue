<!--首页View-->
<template id="home">
  <div>
    <mu-container style="margin:auto;">
      <mu-flex justify-content="start" class="card-container" style="flex-wrap: wrap;">
          <mu-card style="min-width:355px; margin: 10px 8px;height: 312px;" v-for="(info) in cardInfo" :key="info._id">
            <mu-card-header :title="info.nickname" :sub-title="info.update_at_string">
              <mu-avatar slot="avatar">
                {{info.nickname.substring(0, 1)}}
              </mu-avatar>
            </mu-card-header>
            <mu-card-title :title="info.title"></mu-card-title>
            <mu-card-text>
              {{info.about}}
            </mu-card-text>
            <mu-card-text>
              <mu-chip v-for="(chip, index) in info.chips" :key="chip" :color="colors[index%6+1]" style="margin-left: 5px;">{{chip}}</mu-chip>
              <mu-chip style="margin-left: 5px;color: #fff;" v-show="info.chips_length===0" color="blueGrey800">无标签</mu-chip>
            </mu-card-text>
            <mu-card-actions>
              <mu-flex style="width: 100%" justify-content="end">
                <mu-button flat color="primary" right :to="{ name: 'ArticleDetails', params: { id:info._id }}">更多</mu-button>
              </mu-flex>
            </mu-card-actions>
          </mu-card>
      </mu-flex>
    </mu-container>
    <bottom-add></bottom-add>
    <mu-container class="page-content">
      <mu-flex justify-content="center">
        <mu-pagination raised circle :total="total" :current.sync="current" :page-size="9" @change="queryByCurrent"></mu-pagination>
      </mu-flex>
    </mu-container>

  </div>
</template>

<script type="text/ecmascript-6">
import bottomAdd from "@/components/BottomAdd"
import axios from 'axios'
import moment from 'moment'
    export default {
      name: "Home",
      data () {
        return{
          infos: '',
          colors: ['secondary', 'primary', 'success', 'warning', 'info', 'error'],
          total: null,
          current: 1,
          cardInfo:[]
        }
      },
      components:{
        bottomAdd,
      },created:function(){

        axios.post('/api/articles/queryAllArticlesNumber',{
          current: this.current
        }).then((response)=>{
            let res = response.data;
            if (res.status==="200"){
              console.log("返回文章总数");
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
          console.log("返回失败失败");
        });
      },methods:{
        queryByCurrent(){
          axios.post('/api/articles/queryAllArticles',{
            current: this.current
          }).then((response)=>{
              let res = response.data;
              if (res.status==="200"){
                console.log("返回文章信息成功");
                console.log(res.result);
                res.result.forEach(function (item) {
                  item.update_at_string = "更新于"+moment(item.updatedAt).calendar().toString();
                  item.chips_length = item.chips.length;
                });
                this.cardInfo = res.result;
              }else if (res.status==="500"){
                console.log("当前未登录");
              }
            }
          ).catch(err=>{
            console.log(err);
            console.log("返回失败失败");
          });
        }
      }
    }
</script>

<style scoped>
  .card-container{
    width: 100%;
  }
  .page-content{
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
