<!--首页所有文章-->
<template>
  <div>
    <mu-flex justify-content="center" class="card-container">
      <mu-card style="width: 100%;max-width: 355px; margin: 10px 8px;" v-for="info in infos">
        <mu-card-header :title="info.nickname" :sub-title="info.date">
          <mu-avatar slot="avatar">
            {{info.nickname.substring(0, 1)}}
          </mu-avatar>
        </mu-card-header>
        <mu-card-title :title="info.title"></mu-card-title>
        <mu-card-text>
          {{info.about}}
        </mu-card-text>
        <mu-card-actions>
          <!--<mu-button icon color="red">-->
            <!--<mu-icon value="thumb_up"></mu-icon>-->
          <!--</mu-button>-->
          <!--<mu-button icon color="red">-->
            <!--<mu-icon value="thumb_down"></mu-icon>-->
          <!--</mu-button>-->
          <mu-flex style="width: 100%" justify-content="end">
            <mu-button flat color="primary" right>更多</mu-button>
          </mu-flex>
        </mu-card-actions>
      </mu-card>
    </mu-flex>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "ArticalCard",
        data () {
          return {

          }
        },
        props:["infos"]
    }
</script>

<style scoped>
.card-container{
  width: 100%;
}
</style>
