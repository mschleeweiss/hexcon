<template>
  <div class="hc-about">
    <h1 class="hc-nova">About</h1>
    <h4 class="hc-nova">Data/Privacy</h4>
    <p>Yes, I store information in your browser. But these are not cookies to track
    you. I simply store your player name for when you visit this page again. And
    also a session ID for when you loose connection or refresh your browser tab.
    And I will keep it that way, so there is no need for that ugly cookie
    consent banner.</p>
    <h4 class="hc-nova">Techstack</h4>
    <ul>
      <li><a href="https://nestjs.com/">NestJS</a></li>
      <li><a href="https://v3.vuejs.org/">Vue.js 3</a></li>
      <li><a href="https://socket.io/">socket.io</a></li>
      <li><a href="https://github.com/catdad/canvas-confetti">canvas-confetti</a></li>
      <li><a href="https://fontawesome.com/">Font Awesome</a></li>
      </ul>
  </div>
</template>

<style lang="scss" scoped>
.hc-about {
  padding: 3rem;
  height: 100%;

  & h1, & h4, & p {
    margin-bottom: 1rem;
  }

  & ul {
    list-style-type: none;
  }
}
</style>
