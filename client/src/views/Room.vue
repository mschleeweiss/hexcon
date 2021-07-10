<template>
  <div class="hc-room">
    <NotFound v-if="notFound" />
    <RoomFull v-if="roomFull" />
    <Lobby v-if="showLobby" :game="game" />
    <Board
      v-if="showBoard"
      :map="map"
      :players="players"
      :currentPlayer="game?.currentPlayer"
      :playerTiles="playerTiles"
      @mounted="refreshTiles"
      @make-move="syncMove"
    />
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
        !this.game?.active &&
        !this.game?.over
      );
    },
    showBoard() {
      return (
        !this.notFound &&
        !this.roomFull &&
        (this.game?.active || this.game?.over)
      );
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
        console.log(resp);
        if (resp.success) {
          this.refreshTiles();
        }
      });
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
</style>
