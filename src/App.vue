<template>
  <div id="app">
    <notify />
    <md-theme md-name="header">
      <md-whiteframe>
        <md-toolbar>
          <md-layout>
            <h1 class="md-title">Pod Central</h1>
          </md-layout>
          <md-layout md-align="end">
            <md-layout md-flex="15">
              <sign-in/>
            </md-layout>
            <md-layout md-flex="15">
              <sign-up/>
              <confirm-code/>
            </md-layout>
          </md-layout>
        </md-toolbar>
      </md-whiteframe>
    </md-theme>
    <md-theme md-name="body" class="content">
      <router-view></router-view>
    </md-theme>
  </div>
</template>

<script>
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import ConfirmCode from '@/components/ConfirmCode'
import Notify from '@/components/Notify'

export default {
  name: 'app',
  components: {
    SignIn,
    SignUp,
    ConfirmCode,
    Notify
  },
  created() {
    this.$store.dispatch('getCurrentUser')
  }
}
</script>

<style scoped>
.content {
  padding: 10px 2%;
}
</style>
