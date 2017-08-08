import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ItemList from '@/components/ItemList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:id',
      name: 'ItemList',
      props: true,
      component: ItemList
    }
  ]
})
