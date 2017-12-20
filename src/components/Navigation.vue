<template lang="pug">
  nav.navbar.navbar-light.fixed-top.navbar-expand-lg
    router-link.navbar-brand(:to="{name: 'Home'}")
      PODCentral
    button.navbar-toggler(type="button", data-toggle="collapse", data-target="#navbarContent", aria-controls="navbarContent", aria-expanded="false", aria-label="Toggle navigation")
      span.navbar-toggler-icon
    #navbarContent.collapse.navbar-collapse
      ul.navbar-nav.mr-auto
        li.nav-item
          a.nav-link(href="#") Continue Listening
      ul.navbar-nav.ml-auto
        li.nav-item.mr-lg-2
          Facebook.nav-link.social.mb-md-down
        li.nav-item
          Google.nav-link.social
</template>

<script>
import PODCentral from '@/components/PODCentral'
import Facebook from '@/components/social/Facebook'
import Google from '@/components/social/Google'

export default {
  name: 'navigation',
  components: {
    PODCentral,
    Facebook,
    Google
  }
}
</script>

<style lang="scss">
  @import '../sass/custom.scss';
  @include media-breakpoint-down(md) {
    .mb-md-down {
      margin-bottom: 0.5em;
    }
    .social {
      width: 210px;
      padding-left: 0.5em !important;
    }
  }
  nav {
    background-color: #a5a3a0;
  }
  body {
    padding-top: 56px;
  }
</style>
