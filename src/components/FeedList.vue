<template>
  <md-layout md-column>
    <md-card v-for="feed in feeds" :key="feed.id">
      <md-card-area>

        <md-card-header>
          <div class="md-title">Undisclosed</div>
        </md-card-header>

        <md-card-content>
          Welcome to Undisclosed
        </md-card-content>
      </md-card-area>
    </md-card>
  </md-layout>
</template>

<script>
export default {
  name: 'feed-list',
  props: {
    feeds: Array,
  },
}
</script>

<style scoped>
.md-card {
  margin-bottom: 20px;
}
</style>
