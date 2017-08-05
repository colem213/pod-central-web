<template>
  <md-layout md-column>
    <item :id="item.id" v-for="item in allItems" :key="item.id" />
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Item from '@/components/Item'

export default {
  name: 'item-list',
  props: ['id'],
  computed: {
    ...mapGetters(['allItems'])
  },
  beforeMount() {
    this.$store.dispatch('getItemsByChannel', this.id)
  },
  components: {
    Item
  }
}
</script>
