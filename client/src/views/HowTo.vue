<template>
  <div class="hc-howto">
    <h1 class="hc-nova">How to play hex:con</h1>

    <h4 class="hc-nova">Where can I place a tile?</h4>
    <p>
      You can place your tiles on any free cell on the board. However it has to
      have a neighboring cell which is not empty.
    </p>
    <p>
      <strong>Exception:</strong> During the first round every player has to
      place its tiles in one of the corners. Every player has to chose their own
      corner.
    </p>

    <h4 class="hc-nova">How is the score calculated?</h4>
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
      description="Placing the double-blue tile yields 0 points for blue."
    />

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
      description="The lowest scoring color for <em>Player</em> is yellow.
      <em>Player</em> has no yellow tiles at the end of his turn. They can now
      either replace <strong>all of their tiles</strong> or simply resume and
      draw one tile (as usual)."
    />
    <h4 class="hc-nova">How do I win?</h4>
    <p>The highest lowest score wins. But what does that mean?</p>
    <p>
      It doesn't matter how many times you maxed out a color. If your lowest
      score is lower than your opponents lowest score then you will lose the
      game. So the scores are compared from the lowest to the highest.
    </p>
    <Lightbox
      imagePath="winner.jpg"
      description="The lowest score of <em>Player</em> is 9 (yellow). The lowest score of
      <em>Enemy</em> is also 9 (yellow). Therefore the second lowest scores have
      to be compared: <em>Player</em>'s second lowest score is a 11 (purple),
      <em>Enemie</em>'s second lowest score is 10 (purple). This means that
      <em>Player</em> wins this game. They had the
      <em>highest lowest score</em>."
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
</style>
