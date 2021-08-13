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
            <div class="hc-player-name">
              <span v-if="!editUsername || socketId !== player.user.id">{{
                player.user.name
              }}</span>
              <button
                v-if="socketId === player.user.id && !editUsername"
                class="hc-btn hc-btn-outline hc-nova"
                @click="makeUsernameEditable"
              >
                <i class="fas fa-pen"></i>
              </button>

              <input
                v-if="socketId === player.user.id && editUsername"
                v-model="username"
                @keyup.enter="saveUsername"
                class="hc-input"
                ref="username"
                maxlength="20"
              />
              <button
                v-if="socketId === player.user.id && editUsername"
                class="hc-btn hc-btn-outline hc-nova"
                @click="saveUsername"
              >
                <i class="fas fa-save"></i>
              </button>
            </div>
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
          class="hc-btn hc-btn-outline hc-nova emphasized"
          @click="copyLink"
        >
          copy link
        </button>
        <button
          v-if="socketId === adminId"
          class="hc-btn hc-btn-outline hc-nova success"
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
      editUsername: false,
      username: this.$store.state.name,
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
    makeUsernameEditable() {
      this.editUsername = true;
      this.$nextTick(() => {
        this.$refs.username.focus();
      });
    },
    saveUsername() {
      this.editUsername = false;
      this.$store.commit('updateName', this.username);
      this.$socket.client.emit('changeName', { name: this.username });
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
  overflow: auto;
}

.hc-lobby-info {
  background-color: $current-line;
  width: 70%;
  padding: 1rem 2rem;
  overflow: auto;
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

.hc-player-info {
  display: flex;
  align-items: center;
  height: 3rem;
  padding: 0.25rem;
  font-weight: 900;
  justify-content: space-between;
}

.hc-player-name {
  display: flex;
  align-items: center;

  & > span {
    overflow-wrap: anywhere;
  }

  & > .hc-btn {
    border: 0;
    padding: 0.125rem;
    margin: 0.25rem;
    font-size: 0.75rem;
    color: $foreground;
  }
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
