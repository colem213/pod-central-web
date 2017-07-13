<template>
  <div id="app">
    <md-theme md-name="header">
      <md-whiteframe>
        <md-toolbar>
          <md-layout>
            <h1 class="md-title">Pod Central</h1>
          </md-layout>
          <md-layout md-align="end">
            <md-layout md-flex="15">
              <md-button href="#">Sign In</md-button>
            </md-layout>
            <md-layout md-flex="15">
              <md-button>Sign Up</md-button>
            </md-layout>
          </md-layout>
        </md-toolbar>
      </md-whiteframe>
    </md-theme>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped>
.content {
  padding: 10px 2%;
}
</style>
