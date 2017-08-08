<template>
  <md-layout md-column>
    <md-layout>
      <h1>Getting Started</h1>
    </md-layout>
    <md-layout md-column>
      <md-layout>
        <p>
          Start by visiting the homepage of your favorite podcast. 
          Look for a <img :src="feedIcon" id="feed-icon"> icon or a
          subscribe link then follow the instructions <a href="http://www.wikihow.com/Copy-and-Paste-a-Link" target="_blank" rel="noopener noreferrer">here</a>
          to copy and paste that link into the subscription form below!
        </p>
        <p>
          If you can't find a link try copying the url from the address bar.
        </p>
      </md-layout>
      <md-layout>
        <subscribe />
      </md-layout>
    </md-layout>
  </md-layout>
</template>

<script>
import Subscribe from '@/components/Subscribe'
import feedIcon from './feed-icon.svg'

export default {
  name: 'getting-started',
  data: function() {
    return {
      feedIcon
    }
  },
  components: {
    Subscribe
  }
}
</script>

<style>
#feed-icon {
  width: 24px;
}
</style>
