<template>
  <md-layout md-column>
    <h1>{{ msg }}</h1>
    <feed-list :feeds="[{'id': 1234}, {'id': 1235}]"></feed-list>
  </md-layout>
</template>

<script>
import FeedList from '@/components/FeedList'

export default {
  name: 'home',
  data() {
    return {
      msg: 'Welcome to Pod Central',
    }
  },
  components: {
    FeedList,
  },
}
</script>

