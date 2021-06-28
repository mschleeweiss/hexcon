<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  sockets: {
    clientConnected(socketId) {
      this.$store.commit('updateSocketId', socketId);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Lato, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $background;
  color: $foreground;
  height: 100%;
}


</style>
