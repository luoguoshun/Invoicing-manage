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
    ...mapGetters({ accessToken: 'token/accessToken' }),
  },
  methods: {
    //连接SignalR
    connectionSignalR() {
      if (this.$signalR.connection['_connectionState'] !== 'Connected' && this.accessToken.length  != 0) {
        try {
          this.$signalR.connection.start();
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  created() {
    this.connectionSignalR();
  },
};
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
  width: 99.99%;
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
