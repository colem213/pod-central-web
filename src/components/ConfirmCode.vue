<template>
  <md-layout>
    <md-dialog @close="reset" ref="confirmCode">
      <md-dialog-title>Confirm Registration</md-dialog-title>

      <md-dialog-content>
        <form @submit.stop.prevent="submit">
          <md-input-container :class="{'md-input-invalid': errors.has('code')}">
            <label>Confirmation Code</label>
            <md-input name="code" v-model="code" v-validate data-vv-rules="required" data-vv-delay="500" required/>
            <span class="md-error">{{errors.first('code')}}</span>
          </md-input-container>
          <md-button type="submit" class="md-raised md-primary">Submit</md-button>
          <md-button class="md-raised" @click="close('confirmCode')">Cancel</md-button>
        </form>
      </md-dialog-content>
    </md-dialog>
    <md-button v-if="mustConfirm" @click="$refs['confirmCode'].open()">Confirm Code</md-button>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'confirm-code',
  $validates: true,
  data: function() {
    return {
      code: ''
    }
  },
  computed: {
    ...mapGetters(['mustConfirm'])
  },
  watch: {
    mustConfirm: function(mustConfirm) {
      if (mustConfirm) {
        this.$refs['confirmCode'].open()
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
        else this.$store.dispatch('confirmCode', this.code)
      })
    }
  }
}
</script>
