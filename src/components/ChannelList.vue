<template>
  <md-layout md-column>
    <h1>Your Podcasts</h1>
    <channel :channel="ch" v-for="ch in channels" :key="ch.id" />
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Channel from '@/components/Channel'

export default {
  name: 'channel-list',
  computed: {
    ...mapGetters({
      channels: 'allChannels'
    })
  },
  beforeMount() {
    this.$store.dispatch('getAllChannels')
  },
  components: {
    Channel
  }
}
</script>
