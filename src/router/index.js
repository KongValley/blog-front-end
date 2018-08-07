import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import MyArticles from '@/views/MyArticles'
import index from '@/views/index'
import AddArticle from '@/views/AddArticle'
import ArticleDetails from '@/views/ArticleDetails'
import EditArticle from '@/views/EditArticle'
import Chips from '@/views/Chips'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: '/home',
      children:[
        {
          path: 'home',
          name: 'Home',
          component: Home
        },
        {
          path: 'my-articles',
          name: 'MyArticles',
          component: MyArticles
        },{
          path: 'add',
          name: 'AddArticle',
          component: AddArticle
        },{
          path: 'article/:id',
          name: 'ArticleDetails',
          component: ArticleDetails
        },{
          path: 'edit/:id',
          name: 'EditArticle',
          component: EditArticle
        },{
          path: 'chips',
          name: 'Chips',
          component: Chips
        }
      ]
    }
  ]
})
