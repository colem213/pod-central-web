<template lang="pug">
  .row.justify-content-center
    .col-sm-12.col-md-auto
      h2 Welcome to Pod Central
      p Save all your favorite podcasts in one app
      SignIn
</template>

<script>
import SignIn from '@/components/SignIn'

export default {
  name: 'welcome',
  components: {
    SignIn
  }
}
</script>
