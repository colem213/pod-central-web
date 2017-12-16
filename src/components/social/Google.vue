<template lang="pug">
  .google-login.rounded.px-2.py-1
    img.logo.img-fluid.rounded.align-top(:src="googleLogo",alt="Google Logo")
    | Login with Google
</template>

<<script>
import googleLogo from './btn_google_light_normal_ios.svg'

export default {
  name: 'google',
  data: function() {
    return {
      googleLogo
    }
  }
}
</script>

<style scoped>
  .logo {
    width: 1.5em;
    margin-right: 0.5em;
  }
  .google-login {
    font-weight: 600;
    background-color: #dd4b39;
    color: white;
  }
</style>
