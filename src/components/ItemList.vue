<template>
  <md-layout md-column>
    <md-layout md-column v-infinite-scroll="loadItems" :infinite-scroll-disabled="areItemsLoading">
      <item :id="itemId" v-for="itemId in getItems(id)" :key="itemId" />
    </md-layout>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Item from '@/components/Item'

export default {
  name: 'item-list',
  props: ['id'],
  computed: {
    ...mapGetters(['getItems', 'areItemsLoading'])
  },
  methods: {
    loadItems() {
      this.$store.dispatch('getItemsByChannel', this.id)
    }
  },
  components: {
    Item
  }
}
</script>
