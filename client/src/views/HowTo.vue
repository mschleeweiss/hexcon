<template>
  <div class="hc-howto">
    <h1 class="hc-nova">How to play hex:con</h1>

    <h4 class="hc-nova">How can I start a game?</h4>
    <p>
      Create a new game on the starting page. You will be redirected to the game
      lobby. Copy this link and send it to up to 3 other players. Once the
      players are in the lobby and have set their username and confirmed that
      they are ready you can press <em>START GAME</em>.
    </p>

    <h4 class="hc-nova">Where can I place a tile?</h4>
    <p>
      You can place your tiles on any free field on the board. However it has to
      have a neighboring field which is not empty.
    </p>
    <p>
      <strong>Exception:</strong> During the first round every player has to
      place its tiles in one of the corners. Every player has to chose their own
      corner.
    </p>
    <p>
      <strong>Good to know:</strong> It is also possible to place your tiles in
      such a way that individual fields remain free on the game board.
    </p>

    <h4 class="hc-nova">How can I place a tile?</h4>
    <p>
      As soon as it is your turn you can select one of your 6 playable tiles on
      the right side of the board. You can rotate the tile using the small
      rotate button on the selected tile. You can also rotate the tile by
      right-clicking while hovering the board. To place the tile on the board
      simply left-click on the position on the board.
    </p>

    <h4 class="hc-nova">How is the score calculated?</h4>
    <p>
      When placing a tile on the board each symbol on that tile has up to five
      directions which are considered when calculating the score. The sixth
      direction would be the other new symbol which is ignored.
    </p>
    <p>
      You count the adjacent symbols of the same color for each direction.
      Adjacent means that they are connected in a straight line to your placed
      tile. No gaps and no other symbols can be between that adjacent field and
      your newly placed tile.
    </p>
    <p>
      Check the following samples. In-game there are also hints on the fields so
      <strong
        >you will see how many points you can gain before placing a tile</strong
      >.
    </p>
    <p class="hc-lightbox-container">
      <Lightbox
        imagePath="single_tile.jpg"
        description="Placing the purple-blue tile yields 3 points for purple and 1 point for blue."
      />
      <Lightbox
        imagePath="double_tile.jpg"
        description="Placing the double-orange tile yields 6 points for orange."
      />
      <Lightbox
        imagePath="double_tile_zero.jpg"
        description="Placing the double-blue tile yields 0 points for blue. Only existing fields are taken into consideration."
      />
    </p>
    <p>
      <strong>Important:</strong>The max score for each color is 18. Once you
      reach the max score for a color
      <strong class="green">you gain an extra turn!</strong>. After reaching the
      max score you will not gain any more points for that color. Therefore you
      can also only gain one extra turn per color.
    </p>

    <h4 class="hc-nova">How do I get new tiles?</h4>
    <p>
      At the end of your turn you automatically draw a new tile. If you receive
      one or more extra turns then you will receive your new tiles after the
      final extra turn.
    </p>
    <p>
      <strong>Exception:</strong> If you have no tiles with the color of your
      lowest scoring color you have the possibility to return all of your
      current tiles and draw six new ones.
    </p>
    <Lightbox
      imagePath="swap.jpg"
      description="The lowest scoring color for <em>«Player»</em> is yellow.
      <em>«Player»</em> has no yellow tiles at the end of his turn. They can now
      either replace <strong>all of their tiles</strong> or simply resume and
      draw one tile (as usual)."
    />
    <h4 class="hc-nova">How do I win?</h4>
    <p>The game ends when no new tiles can be placed on the board or when a player has reached the max score for all of their colors.</p>
    <p>The highest lowest score wins. But what does that mean?</p>
    <p>
      It doesn't matter how many times you maxed out a color. If your lowest
      score is lower than your opponents lowest score then you will lose the
      game. So the scores are compared from the lowest to the highest.
    </p>
    <Lightbox
      imagePath="winner.jpg"
      description="The lowest score of <em>«Player»</em> is 9 (yellow). The lowest score of
      <em>«Enemy»</em> is also 9 (yellow). Therefore the second lowest scores have
      to be compared: <em>«Player»</em>'s second lowest score is a 11 (purple),
      <em>«Enemy»</em>'s second lowest score is 10 (purple). This means that
      <em>«Player»</em> wins this game. They had the
      <strong>highest lowest score</strong>."
    />
  </div>
</template>

<script>
import Lightbox from '@/components/Lightbox.vue';

export default {
  name: 'HowTo',
  components: {
    Lightbox,
  },
};
</script>

<style lang="scss" scoped>
.hc-howto {
  padding: 2rem 4rem;
  height: 100%;
  overflow: auto;

  & h1,
  & h4,
  & p,
  & img {
    margin-bottom: 1rem;
  }

  & h4 {
    margin-top: 1rem;
  }
}
img {
  max-width: 30rem;
  max-height: 30rem;
}

.hc-lightbox-container {
  display: flex;
  width: 100%;
}

.green {
  color: $green;
}
</style>
