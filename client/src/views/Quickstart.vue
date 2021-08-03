<template>
  <div class="hc-quickstart">
    <div class="hc-hero">
      <div class="hc-mask">
        <div class="hc-content">
          <h1 class="hc-title hc-nova">hex:con</h1>
          <div class="hc-init">
            <button class="hc-btn hc-btn-outline hc-nova" @click="createGame">
              create game
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="hc-description">
      <h3 class="hc-nova">An online board game for 2-4 players</h3>
      <p>
        This game is inspired by the abstract board game
        <em>Einfach Genial</em> (Ingenious/Mensa Connection). The rules are
        simple, place a tile and collect points for the color symbols. The more
        of the same color symbols that are next to each other on the board, the
        more points you can score. But you have to make sure that no color is
        too short - and always keep an eye on the score of the other players.
        Because
        <strong>the player with the highest lowest color score wins</strong>.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quickstart',
  methods: {
    createGame() {
      this.$socket.client.emit('createGame');
    },
  },
  sockets: {
    gameCreated(gameId) {
      this.$router.push({ path: `/room/${gameId}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.hc-quickstart {
  height: 100%;
  text-align: center;
}
.hc-hero {
  background-image: url('~@/assets/hero.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.hc-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.hc-init {
  padding: 1rem;
}

.hc-description {
  text-align: start;
  padding: 2rem 4rem;
  box-sizing: border-box;
}

.hc-title {
  font-size: 4rem;
  margin: 1rem;
}
</style>
