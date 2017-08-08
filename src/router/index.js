import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import ItemList from '@/components/ItemList'

Vue.use(Router)

export default new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/:id',
      name: 'ItemList',
      props: true,
      component: ItemList
    }
  ]
})
