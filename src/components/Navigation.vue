<template lang="pug">
  nav.navbar.navbar-light.fixed-top.navbar-expand-md
    router-link.navbar-brand(:to="{name: 'Home'}")
      span.pod-header-text POD
      | Central
    button.navbar-toggler(type="button", data-toggle="collapse", data-target="#navbarContent", aria-controls="navbarContent", aria-expanded="false", aria-label="Toggle navigation")
      span.navbar-toggler-icon
    #navbarContent.collapse.navbar-collapse
      ul.navbar-nav.mr-auto
        li.nav-item
          a.nav-link(href="#") Continue Listening
</template>

<script>
export default {
  name: 'navigation'
}
</script>

<style lang="scss">
  .pod-header-text {
    font-weight: 900;
    text-transform: uppercase;
  }
  nav {
    background-color: #a5a3a0;
  }
  body {
    padding-top: 56px;
  }
</style>
