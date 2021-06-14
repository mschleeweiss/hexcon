<template>
  <div class="hc-container">
    <header class="hc-header hc-nova">
      <!-- Navbar -->
      <router-link class="hc-routerlink" to="/">home</router-link>
      <router-link class="hc-routerlink" to="/howto">how to play</router-link>
      <router-link class="hc-routerlink" to="/settings">settings</router-link>
      <router-link class="hc-routerlink" to="/about">about</router-link>
      <!-- Navbar -->
    </header>

    <div class="hc-content">
      <router-view />
    </div>

    <div class="hc-footer">
      <span>© 2021 Copyright: <a href="https://hexcon.io/">hexcon.io</a></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Home extends Vue {}
</script>


<style lang="scss" scoped>
.hc-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.hc-header,
.hc-footer {
  background-color: $current-line;
  overflow: hidden;
  height: 3rem;
  min-height: 3rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.hc-header {
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 15%);
}

.hc-routerlink {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0rem 1rem;
  text-decoration: none;
  text-transform: uppercase;
  color: $foreground;
  white-space: nowrap;
  transition: all 0.3s linear;
}

.hc-routerlink.router-link-exact-active {
  color: $orange;
}

.hc-routerlink:hover {
  color: $orange;
}

.hc-content {
  flex-grow: 1;
  overflow: auto;
}

.hc-footer {
  box-shadow: 0 -5px 10px 0 rgb(0 0 0 / 15%);
  padding: 1rem;
}
</style>
