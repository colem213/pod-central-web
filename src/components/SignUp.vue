<template>
  <md-layout>
    <md-dialog md-open-from="#sign-up-form" md-close-to="#sign-up-form" ref="sign-up-dialog">
      <md-dialog-title>Sign Up</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-input-container :class="{'md-input-invalid': errors.has('email')}">
            <label>Email</label>
            <md-input name="email" type="email" v-model="email" v-validate data-vv-rules="required|email" data-vv-delay="500" required/>
            <span class="md-error">{{errors.first('email')}}</span>
          </md-input-container>
          <md-input-container :class="{'md-input-invalid': errors.has('password')}">
            <label>Password</label>
            <md-input name="password" type="password" v-model="password" v-validate data-vv-rules="required|min:8|confirmed:password_confirmation" required/>
            <span class="md-error">{{errors.first('password')}}</span>
          </md-input-container>
          <md-input-container>
            <label>Confirm Password</label>
            <md-input name="password_confirmation" type="password" required/>
          </md-input-container>
        </form>
      </md-dialog-content>
    </md-dialog>
    <md-button id="sign-up-form" @click="open('sign-up-dialog')">Sign Up</md-button>
  </md-layout>
</template>

<<script>
export default {
  name: 'sign-up',
  data: function() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    open(ref) {
      this.$refs[ref].open()
    }
  }
}
</script>
