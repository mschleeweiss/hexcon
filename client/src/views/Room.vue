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
      :state="game?.state"
      :map="map"
      :messages="messages"
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
    messages() {
      return this.game?.log?.messages ?? [];
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
    showGameOver() {
      return (
        !this.notFoundException &&
        !this.roomFullException &&
        this.game?.state === 'over'
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
