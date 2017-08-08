<template>
  <md-layout md-column>
    <md-layout md-row>
      <md-layout md-flex="25">
        <h1>Your Podcasts</h1>
      </md-layout>
      <md-layout md-flex="25" md-flex-offset="50">
        <subscribe />
      </md-layout>
    </md-layout>
    <channel-list />
  </md-layout>
</template>

<script>
import ChannelList from '@/components/ChannelList'
import Subscribe from '@/components/Subscribe'

export default {
  name: 'channel-page',
  components: {
    ChannelList,
    Subscribe
  }
}
</script>

