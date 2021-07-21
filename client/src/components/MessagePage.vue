<template>
  <div class="hc-message-page">
    <div class="hc-message-page-icon">
      <i :class="icon"></i>
    </div>
    <div class="hc-message-page-info">
      <h1>{{ title }}</h1>
      <p v-for="(msg, index) in messages" :key="index" class="hc-message-page-p">
        {{ msg }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessagePage',
  props: {
    icon: {
      type: String,
      default: 'fas fa-info-circle',
    },
    title: {
      type: String,
      default: 'Title',
    },
    messages: {
      type: Array,
      default: () => ['First message', 'Second message'],
    },
  },
};
</script>
