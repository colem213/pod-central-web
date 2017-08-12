<template>
  <div id="app">
    <notify />
    <md-theme md-name="header">
      <md-whiteframe>
        <md-toolbar>
          <md-layout md-row>
            <md-layout md-vertical-align="center">
              <router-link :to="{name: 'Home'}">
                <h1 class="md-title">Pod Central</h1>
              </router-link>
            </md-layout>
            <confirm-code/>
            <sign-in/>
            <sign-out/>
            <sign-up/>
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

<style scoped>
.content {
  padding: 10px 2%;
}
</style>
