<template>
  <div class="hc-lobby">
    <h1>Lobby</h1>
    <div class="hc-playerlist">
      <div
        class="hc-player-card"
        v-for="player in players"
        :key="player.user.id"
      >
        <div class="hc-avatar">
          <i class="fas fa-crown" v-if="isAdmin(player)"></i>
          <i class="fas fa-gamepad" v-if="!isAdmin(player)"></i>
        </div>
        <div class="hc-player">
          <div class="hc-player-tags">
            <span class="hc-tag">You</span>
            <span class="hc-tag error">Not ready</span>
            <span class="hc-tag success">Ready</span>
          </div>
          <div class="hc-player-info">
            {{ player.user.name }}
            <div style="display: flex">
              <input class="hc-checkbox" type="checkbox" id="readybox" v-model="isPlayerReady" />
              <label for="checkbox">Ready</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  props: {
    game: {
      type: Object,
      required: true,
      default: function () {
        return {};
      },
    },
  },
  computed: {
    players() {
      return this.game?.players ?? [];
    },
    socketId() {
      return this.$store.state.socketId;
    },
  },
  methods: {
    isAdmin(player) {
      debugger;
      return this.game.admin.id === player.user.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.hc-lobby {
}

.hc-playerlist {
  width: 33%;
  padding: 1rem;
  box-sizing: border-box;
}

.hc-player-card {
  display: flex;
  border: 1px solid $comment;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
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

.hc-checkbox {
    margin-right: 0.25rem;
}
</style>
