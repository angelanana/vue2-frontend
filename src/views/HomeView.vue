/* eslint-disable */
<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import fetch from '@/apis/index'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data () {
    return {

    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      console.log(111);
      const res = await fetch('users_list')
      const { data, code, message } = res
      if (code === 200) {
        console.log(data, message);
      } else if (code > 0) {

      }
    }
  }
}
</script>
