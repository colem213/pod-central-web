<template>
  <md-layout md-flex="10" v-if="!isAuth">
    <md-dialog @close="reset" md-open-from="#sign-in-form" md-close-to="#sign-in-form" ref="signIn">
      <md-dialog-title>Sign In</md-dialog-title>

      <md-dialog-content>
        <form @submit.stop.prevent="submit" ref="form">
          <md-input-container :class="{'md-input-invalid': errors.has('email')}">
            <label>Email</label>
            <md-input data-vv-name="email" type="email" v-model="email" v-validate data-vv-rules="required|email" data-vv-delay="500" required/>
            <span class="md-error">{{errors.first('email')}}</span>
          </md-input-container>
          <md-input-container :class="{'md-input-invalid': errors.has('password')}">
            <label>Password</label>
            <md-input data-vv-name="password" type="password" v-model="password" v-validate data-vv-rules="required" required/>
            <span class="md-error">{{errors.first('password')}}</span>
          </md-input-container>
          <md-button type="submit" class="md-raised md-primary">Submit</md-button>
          <md-button class="md-raised" @click="$refs.signIn.close()">Cancel</md-button>
        </form>
      </md-dialog-content>
    </md-dialog>
    <md-button id="sign-in-form" @click="$refs.signIn.open()">Sign In</md-button>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'sign-in',
  $validates: true,
  data: function() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['isAuth', 'showSignIn']),
    username() {
      return this.email.replace('@', '_')
    }
  },
  watch: {
    showSignIn: function(showSignIn) {
      if (showSignIn) {
        this.$refs.signIn.open()
      } else {
        this.$refs.signIn.close()
      }
    }
  },
  methods: {
    reset: function() {
      this.$refs.form.reset()
      this.$nextTick(() => {
        this.errors.clear()
      })
    },
    submit: function() {
      this.$validator.validateAll().then(result => {
        if (!result) return
        else this.$store.dispatch('signIn', {username: this.username, password: this.password})
      })
    }
  }
}
</script>

<style>
.md-dialog {
  width: 30%;
  min-width: 345px;
}
</style>
