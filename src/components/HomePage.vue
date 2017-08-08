<template>
  <component :is="view" />
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelPage from '@/components/ChannelPage'
import GettingStartedPage from '@/components/GettingStartedPage'
import WelcomePage from '@/components/WelcomePage'
import ConfirmPage from '@/components/ConfirmPage'

export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'isAuth',
      'isAnon',
      'allChannels'
    ]),
    view() {
      if (this.isAuth && this.allChannels.length > 0) {
        return ChannelPage
      } else if (this.isAuth) {
        return GettingStartedPage
      } else if (!this.isAnon && !this.isAuth) {
        return ConfirmPage
      } else if (this.isAnon) {
        return WelcomePage
      }
    }
  }
}
</script>

