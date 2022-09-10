<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'App',
  computed: {
    ...mapGetters({ getToken: 'token/access_token' }),
  },
  methods: {
    startConnection() {
      if (this.getToken != null) {
        try {
          this.$signalR.connection.start();
          console.log('SignalR Connected.');
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  mounted() {
    this.startConnection();
  },
};
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
  width: 100%;
  font-weight: 350;
  color: #343a40;
  font-family: 'Microsoft Yahei', OpenSans, Avenir, Arial, -apple-system, PingFang SC, Arial, Microsoft YaHei, sans-serif;
}
* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}
</style>
