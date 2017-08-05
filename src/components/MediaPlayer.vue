<template>
  <audio :id="id">
    <source :src="aud.url" :type="aud.type" v-for="aud in audio" :key="aud.url"/>
  </audio>
</template>

<script>
import 'mediaelement/full'
import 'mediaelement/build/mediaelementplayer.css'

const { MediaElementPlayer } = global

export default {
  name: 'media-player',
  props: ['id', 'media'],
  computed: {
    audio: function() {
      return this.media.filter(media => { return media.medium === 'audio' || media.type.startsWith('audio/') })
    }
  },
  mounted() {
    if (this.audio) {
      /* eslint-disable no-new */
      this.player = new MediaElementPlayer(this.id)
    }
  },
  beforeDestroy() {
    if (this.player) {
      if (!this.player.paused) {
        this.player.pause()
      }
      this.player.remove()
    }
  }
}
</script>
