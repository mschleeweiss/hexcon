<template>
  <div>
    <h1 class="hc-nova">How to play this game</h1>

    <h2 class="hc-nova">Where can I place a tile?</h2>
    You can place your tiles on any free cell on the board. However it has to have a neighboring cell which is not empty.

    <h2 class="hc-nova">How is the score calculated?</h2>
    <img src="@/assets/single_tile.jpg" />
    <img src="@/assets/double_tile.jpg" />
    <img src="@/assets/double_tile_zero.jpg" />

    <h2 class="hc-nova">How do I get new tiles?</h2>
    <p>At the end of your turn you automatically draw a new tile. If you receive one or more extra turns then you will receive your new tiles after the final extra turn.</p>
    <p><strong>Exception:</strong></p>If you have no tiles with the color of your lowest scoring color you have the possibility to return all of your current tiles and draw six new ones.
    <img src="@/assets/swap.jpg" />
    <p>The lowest scoring color for "Player" is yellow. "Player" has no yellow tiles at the end of his turn. They can now either replace <strong>all of their tiles</strong> or simply resume and draw one tile (as usual)</p>
    <h2 class="hc-nova">How do I win?</h2>
    <p>The highest lowest score wins. But what does that mean?</p>
    <img src="@/assets/winner.jpg" />
    <p>The lowest score for both players is 9</p>
  </div>
</template>

<style lang="scss" scoped>
img {
  max-width: 30rem;
  max-height: 30rem;
}
</style>
