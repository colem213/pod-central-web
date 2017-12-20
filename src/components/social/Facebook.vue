<template lang="pug">
  .fb-login.rounded
    img.social-logo.img-fluid.rounded.align-top(:src="fbLogo",alt="Facebook Logo")
    | Login with Facebook
</template>

<<script>
import fbLogo from './FB-f-Logo__white_72.png'

export default {
  name: 'facebook',
  data: function() {
    return {
      fbLogo
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../sass/social";

  .fb-login {
    @extend .social-login;
    background-color: #4267B2;
  }
</style>
