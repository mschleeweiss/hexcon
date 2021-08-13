<template>
  <div class="hc-room">
    <div class="hc-snackbar top" :class="{ show: showSnackbar, hide: !showSnackbar }">
      <h4 class="hc-nova">Illegal move</h4>
      {{ snackbarText }}
    </div>
    <MessagePage
      v-if="exception"
      :icon="getExceptionIcon()"
      :title="getExceptionTitle()"
      :messages="getExceptionMsgs()"
    />
    <Lobby v-if="showLobby" :game="game" />
    <Board
      v-if="showBoard"
      :game="game"
      :message="message"
      :playerTiles="playerTiles"
      @mounted="refreshTiles"
      @make-move="syncMove"
      @swap="syncSwap"
    />
  </div>
</template>

<script>
import MessagePage from '@/components/MessagePage.vue';
import Board from '@/components/Board.vue';
import Lobby from '@/components/Lobby.vue';

export default {
  name: 'Room',
  components: {
    Board,
    Lobby,
    MessagePage,
  },
  data() {
    return {
      game: {},
      playerTiles: [],
      notFoundException: false,
      roomFullException: false,
      exception: '',
      moveErrors: {
        invalid_move_first_round:
          'In the first round you have to place your tile in one of the corners. Each player has to chose a different corner.',
        invalid_move_other_rounds:
          'You have to place your tile next to another tile. It cannot be surrounded by empty fields.',
      },
      showSnackbar: false,
      snackbarText: '',
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
    message() {
      return this.game?.log?.message;
    },
    showLobby() {
      return (
        !this.notFoundException &&
        !this.roomFullException &&
        ['lobby', 'startable'].includes(this.game?.state)
      );
    },
    showBoard() {
      return (
        !this.notFoundException &&
        !this.roomFullException &&
        ['awaitingMove', 'awaitingSwap', 'over'].includes(this.game?.state)
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
    getExceptionIcon() {
      const values = {
        game_not_found: 'fas fa-exclamation-triangle',
        room_full: 'fas fa-users-slash',
        game_already_in_progress: 'fas fa-exclamation-triangle',
      };
      return values[this.exception];
    },
    getExceptionTitle() {
      const values = {
        game_not_found: 'Holup!',
        room_full: 'Sorry :(',
        game_already_in_progress: 'Too late!',
      };
      return values[this.exception];
    },
    getExceptionMsgs() {
      const values = {
        game_not_found: [
          'The game you were looking for could not be found.',
          "Maybe it expired. Maybe someone didn't copy and paste the link properly. Maybe we just restarted our servers. Maybe you should create your own game room ;)",
        ],
        room_full: [
          'This game is already at full capacity. We support up to 4 players. With more players it would become unbalanced.',
          'However you can create your own game room ;)',
        ],
        game_already_in_progress: [
          'This game is already in progress.',
          'However you can create your own game room ;)',
        ],
      };
      return values[this.exception];
    },
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
          this.showSnackbar = true;
          this.snackbarText = this.moveErrors[resp.msg];
          window.setTimeout(() => (this.showSnackbar = false), 4000);
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
      this.exception = data.message;
      this.notFoundException = data.message === 'game_not_found';
      this.roomFullException = data.message === 'room_full';
      this.gameRunningException = data.message === 'game_already_in_progress';
    },
  },
};
</script>

<style lang="scss" scoped>
.hc-room {
  height: 100%;
}

.hc-snackbar {
  background-color: $red;
  width: 350px;
}

</style>
