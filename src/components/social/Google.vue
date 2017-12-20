<template lang="pug">
  .google-login.rounded
    img.social-logo.img-fluid.rounded.align-top(:src="googleLogo",alt="Google Logo")
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

<style lang="scss" scoped>
  @import "../../sass/social";

  .google-login {
    @extend .social-login;
    background-color: #dd4b39;
  }
</style>
