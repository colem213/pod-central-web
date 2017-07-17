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
              <audio :id="item.id" :src="audio[0].url" width="80%" preload="metadata"/>
            </md-card-content>
          </md-layout>
        </md-layout>
      </md-card-area>
    </md-card>
</template>

<script>
import 'mediaelement/full'
import '../../node_modules/mediaelement/build/mediaelementplayer.css'

const {MediaElementPlayer} = global

export default {
  name: 'item',
  props: ['item'],
  computed: {
    audio: function() {
      return this.item.media.filter(media => media.medium === 'audio')
    }
  },
  mounted() {
    /* eslint-disable no-new */
    this.player = new MediaElementPlayer(this.item.id, {
      class: 'media',
      preload: 'metadata'
    })
  },
  beforeDestroy() {
    if (!this.player.paused) {
      this.player.pause()
    }
    this.player.remove()
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
