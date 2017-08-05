<template>
  <md-layout md-column>
    <item :item="item" v-for="item in allItems" :key="item.id" />
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Item from '@/components/Item'

export default {
  name: 'item-list',
  computed: {
    ...mapGetters(['allItems'])
  },
  beforeMount() {
    this.$store.dispatch('getItemsByChannel', this.$route.params.channelId)
  },
  components: {
    Item
  }
}
</script>
