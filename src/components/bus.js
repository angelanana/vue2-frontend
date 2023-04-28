import Vue from 'vue'
const Bus = new Vue({
  methods: {
    ons (events, callback) {
      events.forEach(event => {
        this.$on(event, callback)
      })
    },
    on (event, callback) {
      this.$on(event, callback)
    },
    off (event, callback) {
      this.$off(event, callback)
    },
    emit (event, ...args) {
      this.$emit(event, ...args)
    }
  }
})
export default Bus
