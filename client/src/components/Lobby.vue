<template>
  <div class="hc-lobby">
    <div class="hc-snackbar left" :class="{ show: showSnackbar }">
      <h4 class="hc-nova">Link copied!</h4>
      Send it to up to 3 other players.
    </div>
    <div class="hc-playerlist">
      <div
        class="hc-player-card"
        v-for="player in players"
        :key="player.user.id"
      >
        <div class="hc-avatar">
          <i class="fas fa-crown" v-if="player.user.id === adminId"></i>
          <i class="fas fa-gamepad" v-if="player.user.id !== adminId"></i>
        </div>
        <div class="hc-player">
          <div class="hc-player-tags">
            <span v-if="socketId === player.user.id" class="hc-tag">You</span>
            <span v-if="!player.ready" class="hc-tag error">Not ready</span>
            <span v-if="player.ready" class="hc-tag success">Ready</span>
          </div>
          <div class="hc-player-info">
            {{ player.user.name }}
            <div v-if="socketId === player.user.id" class="hc-checkbox-wrapper">
              <input
                class="hc-checkbox"
                type="checkbox"
                id="readybox"
                :checked="player.ready"
                @change="changePlayerReady"
              />
              <label for="checkbox">Ready</label>
            </div>
          </div>
        </div>
      </div>

      <div class="hc-button-area">
        <button
          class="hc-btn hc-btn-outline hc-nova hc-emphasized"
          @click="copyLink"
        >
          copy link
        </button>
        <button
          v-if="socketId === adminId"
          class="hc-btn hc-btn-outline hc-nova hc-success"
          @click="startGame"
          :disabled="game.state === 'lobby'"
        >
          start game
        </button>
      </div>
    </div>
    <div class="hc-lobby-info"><HowTo /></div>
  </div>
</template>

<script>
import HowTo from '@/views/HowTo';

export default {
  name: 'Lobby',
  components: {
    HowTo: HowTo,
  },
  props: {
    game: {
      type: Object,
      required: true,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      showSnackbar: false,
    };
  },
  computed: {
    players() {
      return this.game?.players ?? [];
    },
    adminId() {
      return this.game?.admin?.id ?? '';
    },
    gameId() {
      return this.$route.params.gameid;
    },
    socketId() {
      return this.$store.state.socketId;
    },
  },
  methods: {
    changePlayerReady() {
      this.$socket.client.emit('toggleReadiness', {
        gameId: this.gameId,
      });
    },
    copyLink() {
      const dummy = document.createElement('input');
      const url = window.location.href;
      document.body.appendChild(dummy);
      dummy.value = url;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      this.showSnackbar = true;
      window.setTimeout(() => (this.showSnackbar = false), 4000);
    },
    startGame() {
      this.$socket.client.emit('startGame', {
        gameId: this.gameId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.hc-lobby {
  display: flex;
  height: 100%;
}

.hc-playerlist {
  width: 30%;
  padding: 1rem;
  box-sizing: border-box;
}

.hc-lobby-info {
  background-color: $current-line;
  width: 70%;
  padding: 1rem 2rem;
}

.hc-player-card {
  display: flex;
  border: 1px solid $comment;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.hc-avatar {
  width: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $current-line;
  border-radius: 0.25rem 0 0 0.25rem;
}

.hc-avatar .fa-crown {
  color: $purple;
}

.hc-player {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.hc-player-tags {
  display: flex;
  padding: 0.25rem;
}

.hc-tag {
  margin-right: 0.25rem;
}
.hc-tag.error {
  background-color: rgba($red, 0.6);
}
.hc-tag.success {
  background-color: rgba($green, 0.6);
}

.hc-player-info {
  display: flex;
  align-items: center;
  height: 3rem;
  padding: 0.25rem;
  font-weight: 900;
  justify-content: space-between;
}

.hc-checkbox-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hc-checkbox {
  margin-right: 0.25rem;
}

.hc-button-area {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.hc-snackbar {
  background-color: $cyan;
  color: $background;
}
</style>
