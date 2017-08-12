<template>
  <md-layout md-column>
    <md-layout>
      <md-button @click="sortToggle" class="md-raised">Publish Date <md-icon>{{arrow}}</md-icon></md-button>
    </md-layout>
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
    ...mapGetters(['getItems', 'areItemsLoading', 'getSortAsc']),
    arrow() {
      return this.getSortAsc(this.id) ? 'arrow_upward' : 'arrow_downward'
    }
  },
  methods: {
    loadItems() {
      this.$store.dispatch('getItemsByChannel', this.id)
    },
    sortToggle() {
      this.$store.dispatch('itemsToggleSort', this.id)
    }
  },
  components: {
    Item
  }
}
</script>
