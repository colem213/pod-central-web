<template>
  <md-theme name="red">
    <md-snackbar :md-position="vertical + ' ' + horizontal" ref="snackbar" :md-duration="duration">
      <span>{{text}}</span>
      <md-button class="md-accent" @click="$refs.snackbar.close()">Close</md-button>
    </md-snackbar>
  </md-theme>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['message']),
    text() {
      return this.message.text
    },
    vertical() {
      return this.message.vertical
    },
    horizontal() {
      return this.message.horizontal
    },
    duration() {
      return this.message.duration
    }
  },
  watch: {
    message: function() {
      this.open()
    }
  },
  methods: {
    open() {
      this.$refs.snackbar.open()
    }
  }
}
</script>
