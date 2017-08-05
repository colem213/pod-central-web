import Vue from 'vue'
import Router from 'vue-router'
import ChannelList from '@/components/ChannelList'
import ItemList from '@/components/ItemList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChannelList',
      component: ChannelList
    },
    {
      path: '/:id',
      name: 'ItemList',
      props: true,
      component: ItemList
    }
  ]
})
