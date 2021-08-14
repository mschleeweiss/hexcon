<template>
  <div class="hc-about">
    <h1 class="hc-nova">About hex:con</h1>
    <h4 class="hc-nova">Legal notice</h4>
    <p>Information according to § 5 TMG</p>
    <ul>
      <li>Max Mustermann</li>
      <li>Sample street 111</li>
      <li>Building 44</li>
      <li>90210 sample city</li>
    </ul>

    <h4 class="hc-nova">Contact</h4>
    <ul>
      <li>Phone: +49 (0) 123 44 55 66</li>
      <li>E-mail: mustermann@musterfirma.de</li>
    </ul>
    <h4 class="hc-nova">Data/Privacy</h4>
    <p>
      Yes, I store information in your browser. But these are not cookies to
      track you. I simply store your player name for when you visit this page
      again. And also a session ID for when you loose connection or refresh your
      browser tab. And I will keep it that way, so there is no need for that
      ugly cookie consent banner.
    </p>
    <h4 class="hc-nova">Techstack</h4>
    <ul>
      <li><a href="https://nestjs.com/">NestJS</a></li>
      <li><a href="https://v3.vuejs.org/">Vue.js 3</a></li>
      <li><a href="https://socket.io/">socket.io</a></li>
      <li>
        <a href="https://github.com/catdad/canvas-confetti">canvas-confetti</a>
      </li>
      <li><a href="https://fontawesome.com/">Font Awesome</a></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.hc-about {
  padding: 2rem 4rem;
  height: 100%;
  overflow: auto;

  & h4 {
    margin-top: 2rem;
  }
  & p,
  & ul {
    margin-top: 1rem;
  }

  & ul {
    list-style-type: none;
  }
}
</style>
