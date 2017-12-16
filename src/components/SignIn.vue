<template lang="pug">
  .row
    .col-sm-12.col-md-auto.mb-2.mb-md-0
      Facebook
    .col-sm-12.col-md-auto
      Google
</template>

<script>
import Facebook from '@/components/social/Facebook'
import Google from '@/components/social/Google'

export default {
  name: 'sign-in',
  components: {
    Facebook,
    Google
  }
}
</script>
