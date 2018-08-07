<template>
    <mu-container>
      <mu-chip v-for="(chip, index) in chips" :key="chip" :color="colors[index%6+1]" style="margin-left: 10px;margin-top: 10px">{{chip}}</mu-chip>
    </mu-container>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
    export default {
        name: "chips",
        data() {
            return {
              colors: ['secondary', 'primary', 'success', 'warning', 'info', 'error'],
              chips:[]
            }
        },mounted(){
          axios.post('/api/articles/queryAllChips').then((response)=>{
            let res = response.data;
            if (res.status==="200"){
              console.log("返回登录信息成功");
              console.log(res.result);
              this.chips=this.removal(res.result);
            }else if (res.status==="500"){
              console.log("当前未登录");
            }
          }).catch(err=>{
            console.log(err)
            console.log("返回失败失败");
          });
        },methods: {
          //数组去重
          removal:function (array) {
            Array.prototype.distinct = function (){
              var arr = this,
                len = arr.length;
              arr.sort(function(a,b){  //对数组进行排序方便比较
                return a - b;
              })
              function loop(index){
                if(index >= 1){
                  if(arr[index] === arr[index-1]){
                    arr.splice(index,1);
                  }
                  loop(index - 1); //递归loop函数进行去重
                }
              }
              loop(len-1);
              return arr;
            };

            var a = array;
            var b = a.distinct();
            return b;
          }
        }
    }
</script>

<style scoped>

</style>
