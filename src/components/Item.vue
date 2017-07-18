<template>
    <md-card>
      <md-card-area>
        <md-layout>
          <md-card-media>
            <a href="#"><img :src="item.imageUrl" class="item-poster"></img></a>
          </md-card-media>
          <md-layout md-column>
            <md-card-header>
              <a href="#"><div class="md-title">{{item.title}}</div></a>
              <div class="md-subhead">{{item.pubDate}}</div>
            </md-card-header>

            <md-card-content>
              {{item.description}}
            </md-card-content>
            <md-card-content>
              {{item.keywords.join(', ')}}
            </md-card-content>
            <md-card-content>
              <media-player :id="item.id" :media="item.media" width="100%" preload="metadata"/>
            </md-card-content>
          </md-layout>
        </md-layout>
      </md-card-area>
    </md-card>
</template>

<script>
import MediaPlayer from '@/components/MediaPlayer'

export default {
  name: 'item',
  props: ['item'],
  components: {
    MediaPlayer
  }
}
</script>

<style scoped>
.md-card {
  margin-bottom: 20px;
  padding: 10px;
}
.item-poster {
  max-width: 200px;
}
</style>
