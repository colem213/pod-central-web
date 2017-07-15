<template>
  <md-layout md-column>
    <h1>{{ msg }}</h1>
    <channel-list />
  </md-layout>
</template>

<script>
import ChannelList from '@/components/ChannelList'

export default {
  name: 'home',
  data() {
    return {
      msg: 'Your Podcasts'
    }
  },
  components: {
    ChannelList
  }
}
</script>

