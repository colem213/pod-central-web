<template>
  <md-layout v-if="isAuth">
    <form @submit.stop.prevent="submit">
      <md-layout>
        <md-layout md-flex="85">
          <md-input-container :class="{'md-input-invalid': errors.has('url')}">
            <label>RSS Feed URL</label>
            <md-input data-vv-name="url" v-model="url" v-validate data-vv-rules="required|url" data-vv-delay="500" />
            <span class="md-error">{{errors.first('url')}}</span>
            <md-icon :md-src="feedIcon"></md-icon>
          </md-input-container>
        </md-layout>
        <md-layout md-flex="15" md-align="center" md-vertical-align="center">
          <md-button type="submit" class="md-raised md-primary md-icon-button md-dense">
            <md-icon>add</md-icon>
            <md-tooltip md-delay="500">Subscribe!</md-tooltip>
          </md-button>
        </md-layout>
      </md-layout>
    </form>
  </md-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import feedIcon from './feed-icon.svg'

export default {
  name: 'subscribe',
  $validates: true,
  data: function() {
    return {
      url: '',
      feedIcon
    }
  },
  watch: {
    url: function(url) {
      if (url.length === 0) {
        this.errors.clear()
      }
    }
  },
  computed: {
    ...mapGetters(['isAuth'])
  },
  methods: {
    ...mapActions(['subscribe']),
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.subscribe(this.url)
      })
    }
  }
}
</script>

<style scoped>
form {
  width: 100%;
}
</style>
