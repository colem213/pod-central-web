<template lang="pug">
  #app.container-fluid
    Navigation
    router-view
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
  name: 'app',
  created() {
    this.$store.dispatch('getCurrentUser')
  },
  components: {
    Navigation
  }
}
</script>

<style lang="scss">
</style>
