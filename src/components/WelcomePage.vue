<template lang="pug">
  .row
    .col-auto
      h2 Welcome to 
        PODCentral
      p Save all your favorite podcasts in one app
</template>

<script>
import PODCentral from '@/components/PODCentral'

export default {
  name: 'welcome',
  components: {
    PODCentral
  }
}
</script>
