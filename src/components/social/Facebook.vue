<template lang="pug">
  .fb-login.rounded.px-2.py-1
    img.logo.img-fluid.rounded.align-top(:src="fbLogo",alt="Facebook Logo")
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

<style scoped>
  .logo {
    width: 1.5em;
    margin-right: 0.5em;
  }
  .fb-login {
    font-weight: 600;
    background-color: #4267B2;
    color: white;
  }
</style>
