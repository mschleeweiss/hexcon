<template>
  <div class="hc-room">
    <NotFound v-if="notFound" />
    <RoomFull v-if="roomFull" />
    <Lobby v-if="showLobby" :game="game" />
    <Board
      v-if="showBoard"
      :state="game?.state"
      :map="map"
      :players="players"
      :currentPlayer="game?.currentPlayer"
      :playerTiles="playerTiles"
      @mounted="refreshTiles"
      @make-move="syncMove"
      @swap="syncSwap"
    />
    <div v-if="showGameOver" class="hc-mask hc-gameover">
      <div
        :class="{
          success: game?.winner._user.id === socketId,
          error: game?.winner._user.id !== socketId,
        }"
      >
        <h1 class="hc-title hc-nova">Game Over</h1>
        <p v-if="game?.winner._user.id === socketId">You won :)</p>
        <p v-if="game?.winner._user.id !== socketId">
          You lost :( The winner of this match is {{ game?.winner._user.name }}.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NotFound from '@/components/NotFound.vue';
import RoomFull from '@/components/RoomFull.vue';
import Board from '@/components/Board.vue';
import Lobby from '@/components/Lobby.vue';

export default {
  name: 'Room',
  components: {
    Board,
    Lobby,
    NotFound,
    RoomFull,
  },
  data() {
    return {
      game: {},
      playerTiles: [],
      notFound: false,
      roomFull: false,
    };
  },
  computed: {
    gameId() {
      return this.$route.params.gameid;
    },
    players() {
      return this.game?.players ?? [];
    },
    map() {
      return this.game?.board?.map ?? [];
    },
    showLobby() {
      return (
        !this.notFound &&
        !this.roomFull &&
        ['lobby', 'startable'].includes(this.game?.state)
      );
    },
    showBoard() {
      return (
        !this.notFound &&
        !this.roomFull &&
        ['awaitingMove', 'awaitingSwap', 'over'].includes(this.game?.state)
      );
    },
    showGameOver() {
      return !this.notFound && !this.roomFull && this.game?.state === 'over';
    },
    socketId() {
      return this.$store.state.socketId;
    },
  },
  mounted() {
    this.$socket.client.emit('joinGame', {
      gameId: this.gameId,
    });
  },
  methods: {
    refreshTiles() {
      const data = { gameId: this.gameId };
      const ack = (tiles) => {
        this.playerTiles = tiles;
      };
      this.$socket.client.emit('refreshTiles', data, ack);
    },
    syncMove(tile) {
      const data = { gameId: this.gameId, tile };
      this.$socket.client.emit('placeTile', data, (resp) => {
        if (resp.success) {
          this.refreshTiles();
        } else {
          alert(resp.msg);
        }
      });
    },
    syncSwap(shouldSwap) {
      const data = { gameId: this.gameId, shouldSwap };
      const ack = (tiles) => {
        this.playerTiles = tiles;
      };
      this.$socket.client.emit('swapTiles', data, ack);
    },
  },
  sockets: {
    gameStateChanged(game) {
      this.game = game;
    },
    exception(data) {
      this.notFound = data.message === 'game_not_found';
      this.roomFull = data.message === 'room_full';
    },
  },
};
</script>

<style lang="scss" scoped>
.hc-room {
  height: 100%;
}

.hc-gameover {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: 2px 2px 3px #000;

  & > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;

    &.success {
      background-color: rgba($green, 0.5);
    }
    &.error {
      background-color: rgba($red, 0.5);
    }
  }

  & h1 {
    font-size: 4rem;
  }

  & p {
    font-size: 1.5rem;
    font-weight: 900;
  }
}
</style>
