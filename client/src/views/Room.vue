<template>
  <div class="hc-room">
    <NotFound v-if="notFound" />
    <RoomFull v-if="roomFull" />
    <div v-if="!notFound">
      <h1>Lobby</h1>
      <p>{{ game }}</p>
      <svg viewBox="0 0 1000 1000">
        <defs>
          <g id="pod">
            <polygon
              stroke="#000000"
              stroke-width="0.5"
              :points="hexPoints"
            />
          </g>
        </defs>
        <g class="pod-wrap">
          <use xlink:href="#pod" transform="translate(0, 0)" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import NotFound from '@/components/NotFound.vue';
import RoomFull from '@/components/RoomFull.vue';
import { Hex, Layout, Point } from '@/hex';

export default {
  name: 'Room',
  components: {
    NotFound,
    RoomFull,
  },
  data() {
    return {
      game: null,
      notFound: false,
      roomFull: false,
    };
  },
  computed: {
    gameId() {
      return this.$route.params.gameid;
    },
    hexPoints() {
      return this.layout
        .polygonCorners(new Hex(0, 0, 0))
        .map((o) => `${Math.round(o.x)},${Math.round(o.y)}`)
        .join(' ');
    },
    layout() {
      return new Layout(Layout.flat, new Point(100, 100), new Point(0, 0));
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
