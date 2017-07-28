<template>
  <md-layout md-flex="10" v-if="isAuth">
    <md-dialog md-open-from="#sign-out" md-close-to="#sign-out" ref="signOut">
      <md-dialog-title>Are you sure?</md-dialog-title>
  
      <md-dialog-content>
        <md-button class="md-primary" @click="signOut()">Yes</md-button>
        <md-button class="md-primary" @click="$refs.signOut.close()">No</md-button>
      </md-dialog-content>
    </md-dialog>
    <md-button id="sign-out" @click="$refs.signOut.open()">Sign Out</md-button>
  
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'sign-out',
  computed: {
    ...mapGetters(['isAuth'])
  },
  methods: {
    signOut() {
      this.$store.dispatch('signOut')
      this.$refs.signOut.close()
    }
  }
}
</script>
