<template>
    <md-card>
      <md-card-area>
        <md-layout>
        <md-card-media>
          <a href="#"><img :src="channel.imageUrl" class="channel-poster"></img></a>
        </md-card-media>
        <md-layout>
        <md-card-header>
          <a href="#"><div class="md-title">{{channel.title}}</div></a>
          <div class="md-subhead">{{channel.category}}</div>
        </md-card-header>

        <md-card-content>
          {{channel.description}}
        </md-card-content>
        </md-layout>
        </md-layout>
      </md-card-area>
    </md-card>
</template>

<script>
export default {
  name: 'channel',
  props: ['channel']
}
</script>

<style scoped>
.md-card {
  margin-bottom: 20px;
  padding: 10px;
}
.channel-poster {
  max-width: 200px;
}
</style>
