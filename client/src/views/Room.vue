<template>
  <div class="hc-room">
    <NotFound v-if="notFound" />
    <RoomFull v-if="roomFull" />
    <div v-if="!notFound && !roomFull">
      <h1>Lobby</h1>
      <svg viewBox="-1000 -1000 2000 2000">
        <defs>
          <g id="pod">
            <polygon :points="hexPoints" />
          </g>
        </defs>
        <g class="hc-cell">
          <use
            :class="{
              active: cell[1] === 0,
              red:    cell[1] === 1,
              green:  cell[1] === 2,
              yellow: cell[1] === 3,
              purple: cell[1] === 4,
              orange: cell[1] === 5,
              blue:   cell[1] === 6,
              }"
            v-for="cell in map"
            :key="cell"
            xlink:href="#pod"
            :transform="calcTransformation(cell[0])"
          />
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
    map() {
      return this.game?.board.map ?? [];
    },
    hexPoints() {
      return this.layout
        .polygonCorners(new Hex(0, 0, 0))
        .map((o) => `${Math.round(o.x)},${Math.round(o.y)}`)
        .join(' ');
    },
    layout() {
      return new Layout(Layout.pointy, new Point(100, 100), new Point(0, 0));
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
    calcTransformation(coords) {
      const hex = new Hex(coords.q, coords.r, coords.s);
      const point = this.layout.hexToPixel(hex);
      return `translate(${point.x},${point.y})`;
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

.hc-cell use {
  fill: $current-line;
  stroke: $comment;
  stroke-width: 0.5rem;
  transition: all 0.5s ease;
}

.hc-cell use.active:hover {
  cursor: pointer;
  fill: $foreground;
}

.hc-cell use.red {
  fill: $red;
}
.hc-cell use.green {
  fill: $green;
}
.hc-cell use.yellow {
  fill: $yellow;
}
.hc-cell use.purple {
  fill: $purple;
}
.hc-cell use.orange {
  fill: $orange;
}
.hc-cell use.blue {
  fill: $cyan;
}
</style>
