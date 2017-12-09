<template lang="pug">
  #app.container
    .row
      notify
      .row
        router-link(:to="{name: 'Home'}")
          h1 Pod Central
        confirm-code
        sign-in
        sign-out
        sign-up
      router-view
</template>

<script>
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import SignOut from '@/components/SignOut'
import ConfirmCode from '@/components/ConfirmCode'
import Notify from '@/components/Notify'

export default {
  name: 'app',
  components: {
    SignIn,
    SignUp,
    SignOut,
    ConfirmCode,
    Notify
  },
  created() {
    this.$store.dispatch('getCurrentUser')
  }
}
</script>

<style>
</style>
