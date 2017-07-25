<template>
  <md-layout>
    <md-dialog @close="reset" md-open-from="#sign-up-form" md-close-to="#sign-up-form" ref="signup">
      <md-dialog-title>Sign Up</md-dialog-title>

      <md-dialog-content>
        <form @submit.stop.prevent="submit">
          <md-input-container :class="{'md-input-invalid': errors.has('email')}">
            <label>Email</label>
            <md-input name="email" type="email" v-model="email" v-validate data-vv-rules="required|email" data-vv-delay="500" required/>
            <span class="md-error">{{errors.first('email')}}</span>
          </md-input-container>
          <md-input-container :class="{'md-input-invalid': errors.has('password')}">
            <label>Password</label>
            <md-input name="password" type="password" v-model="password" v-validate data-vv-rules="required|confirmed:password_confirmation" required/>
            <span class="md-error">{{errors.first('password')}}</span>
          </md-input-container>
          <md-input-container>
            <label>Confirm Password</label>
            <md-input name="password_confirmation" type="password" required/>
          </md-input-container>
          <md-button type="submit" class="md-raised md-primary">Submit</md-button>
          <md-button class="md-raised" @click="close('signup')">Cancel</md-button>
        </form>
      </md-dialog-content>
    </md-dialog>
    <md-button id="sign-up-form" v-if="isAnon" @click="$refs.signup.open()">Sign Up</md-button>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'sign-up',
  $validates: true,
  data: function() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['isAnon']),
    username() {
      return this.email.replace('@', '_')
    }
  },
  watch: {
    isAnon: function(isAnon) {
      if (!isAnon) {
        this.close('signup')
      }
    }
  },
  methods: {
    close(ref) {
      this.$refs[ref].close()
      this.reset()
    },
    reset() {
      this.errors.clear()
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (!result) return
        else this.$store.dispatch('signUp', {username: this.username, email: this.email, password: this.password})
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
