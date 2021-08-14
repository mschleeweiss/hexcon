<template>
  <div class="hd-page">
    <div class="hc-container">
      <header class="hc-header hc-nova">
        <router-link class="hc-routerlink" to="/">
          <i class="fas fa-home"></i>
        </router-link>
        <router-link class="hc-routerlink" to="/howto">
          <i class="fas fa-book"></i>
        </router-link>
        <router-link class="hc-routerlink" to="/about">
          <i class="fas fa-info"></i>
        </router-link>
      </header>

      <div class="hc-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <div class="hc-footer">
        <span
          >© 2021 Copyright: <a href="https://hexcon.io/">hexcon.io</a></span
        > 
        <!-- <i class="fab fa-paypal"></i> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style lang="scss" scoped>
.hd-page {
  display: flex;
  justify-content: center;
  height: 100%;
}
.hc-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1024px;
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 20%);
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
  padding: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
