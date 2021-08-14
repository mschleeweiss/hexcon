<template>
  <div class="hc-howto">
    <h1 class="hc-nova">How to play this game</h1>

    <h4 class="hc-nova">Where can I place a tile?</h4>
    <p>
      You can place your tiles on any free cell on the board. However it has to
      have a neighboring cell which is not empty.
    </p>

    <h4 class="hc-nova">How is the score calculated?</h4>
    <img src="@/assets/single_tile.jpg" />
    <img src="@/assets/double_tile.jpg" />
    <img src="@/assets/double_tile_zero.jpg" />

    <h4 class="hc-nova">How do I get new tiles?</h4>
    <p>
      At the end of your turn you automatically draw a new tile. If you receive
      one or more extra turns then you will receive your new tiles after the
      final extra turn.
    </p>
    <p><strong>Exception:</strong></p>
    If you have no tiles with the color of your lowest scoring color you have
    the possibility to return all of your current tiles and draw six new ones.
    <img src="@/assets/swap.jpg" />
    <p>
      The lowest scoring color for "Player" is yellow. "Player" has no yellow
      tiles at the end of his turn. They can now either replace
      <strong>all of their tiles</strong> or simply resume and draw one tile (as
      usual)
    </p>
    <h4 class="hc-nova">How do I win?</h4>
    <p>The highest lowest score wins. But what does that mean?</p>
    <img src="@/assets/winner.jpg" />
    <p>The lowest score for both players is 9</p>
  </div>
</template>

<style lang="scss" scoped>
.hc-howto {
  padding: 3rem;
  height: 100%;
  overflow: auto;

  & h1,
  & h4,
  & p {
    margin-bottom: 1rem;
  }
}
img {
  max-width: 30rem;
  max-height: 30rem;
}
</style>
