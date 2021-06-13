<template>
  <div class="hc-quickstart">
    <div class="hc-hero">
      <div class="hc-mask">
        <div class="hc-content">
          <h1 class="hc-title hc-nova">hex:con</h1>
          <div class="hc-init">
            <button class="hc-btn hc-btn-outline hc-nova">CREATE GAME</button>
          </div>
        </div>
      </div>
    </div>
    <div class="hc-description">
      <h3 class="hc-nova">An online board game for 2-4 players</h3>
      <p>
        The unusual victory condition ('highest lowest score wins') requires
        players to develop all six colours and drives a higher degree of
        strategic planning than would otherwise be the case. Tactical
        considerations include not only how many points a player will earn by
        placing a particular tile, but also which colours they will score on,
        often resulting in a trade-off between the two. Building large blocks of
        one colour also leads to higher scoring opportunities for one's
        opponent, and gameplay often revolves around a player tactically
        blocking a colour for which they have already established a scoring
        advantage. The unusual victory condition ('highest lowest score wins') requires
        players to develop all six colours and drives a higher degree of
        strategic planning than would otherwise be the case. Tactical
        considerations include not only how many points a player will earn by
        placing a particular tile, but also which colours they will score on,
        often resulting in a trade-off between the two. Building large blocks of
        one colour also leads to higher scoring opportunities for one's
        opponent, and gameplay often revolves around a player tactically
        blocking a colour for which they have already established a scoring
        advantage.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Quickstart extends Vue {}
</script>

<style lang="scss" scoped>

.hc-quickstart {
  height: 100%;
}
.hc-hero {
  background-image: url('../assets/hero.jpeg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.hc-content {
  display: flex;
  flex-direction: column;
}

.hc-description {
  text-align: start;
  padding: 2rem 4rem;
  box-sizing: border-box;
}

.hc-btn {
  border-radius: 2px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.hc-btn-outline {
  background-color: transparent;
  border: 2px solid $foreground;
  color: $foreground;
}

.hc-title {
  font-size: 4rem;
  margin-top: 2rem;
}
</style>
