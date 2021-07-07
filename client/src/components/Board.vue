<template>
  <div class="hc-board">
    <div class="hc-playerstats">
      <div
        class="hc-scorepanel hc-border"
        :class="{ active: currentPlayer.user?.id === player.user.id }"
        v-for="player in players"
        :key="player.user.id"
      >
        <div class="hc-playername">
          {{ player.user.name }}
          <span v-if="socketId === player.user.id" class="hc-tag">You</span>
        </div>
        <div
          v-for="score in player.score.values"
          :key="score.type"
          class="hc-scorebar"
        >
          <div
            class="hc-score-id hc-scorepoint"
            :class="calcColor(score.type)"
            style="--point: 18"
          />
          <div
            v-for="point in scorePoints"
            :key="point"
            class="hc-scorepoint"
            :class="[
              calcColor(score.type),
              { active: point <= score.value + 5 },
            ]"
            :style="`--point:${point}`"
          />
        </div>
      </div>
    </div>
    <div class="hc-svg-container">
      <svg class="hc-map" :viewBox="viewBox">
        <defs>
          <g id="pod">
            <polygon :points="hexPoints" />
          </g>
        </defs>
        <g class="hc-cell">
          <use
            :class="[
              calcColor(cell.type),
              {
                active: cell.type === 0 && currentPlayer.user?.id === socketId,
              },
            ]"
            v-for="cell in map"
            :key="cell"
            xlink:href="#pod"
            :transform="calcTransformation(cell.coords)"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { Hex, Layout, Point } from '@/hex';

export default {
  name: 'Board',
  props: {
    map: {
      type: Array,
      required: true,
      default: () => [],
    },
    players: {
      type: Array,
      required: true,
      default: () => [],
    },
    currentPlayer: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      colorKeys: {
        1: 'red',
        2: 'green',
        3: 'yellow',
        4: 'purple',
        5: 'orange',
        6: 'blue',
      },
    };
  },
  computed: {
    hexPoints() {
      return this.layout
        .polygonCorners(new Hex(0, 0, 0))
        .map((o) => `${Math.round(o.x)},${Math.round(o.y)}`)
        .join(' ');
    },
    viewBox() {
      const rightHex = this.cellToHex(this.map[this.map.length - 1]);
      const point = this.layout.polygonCorners(rightHex)[0]

      const offset = Math.ceil(point.x);
      const size = offset * 2;

      return `-${offset} -${offset} ${size} ${size}`;
    },
    layout() {
      return new Layout(Layout.pointy, new Point(100, 100), new Point(0, 0));
    },
    socketId() {
      return this.$store.state.socketId;
    },
    scorePoints() {
      return Array(18)
        .fill()
        .map((_, i) => i + 1);
    },
  },
  methods: {
    calcColor(id) {
      return this.colorKeys[id];
    },
    calcTransformation(coords) {
      const hex = new Hex(coords.q, coords.r, coords.s);
      const point = this.layout.hexToPixel(hex);
      return `translate(${point.x},${point.y})`;
    },
    cellToHex(cell) {
      return new Hex(cell.coords.q, cell.coords.r, cell.coords.s);
    },
  },
};
</script>

<style lang="scss" scoped>
:root {
  --point: 0;
}

.hc-board {
  height: 100%;
  display: flex;
}

.hc-playerstats {
  min-width: 21rem;
  width: 20%;
  padding: 1rem;
  overflow: scroll;
}

.hc-svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
}

.hc-map {
  height: 100%;
}

.hc-cell use {
  stroke: $background;
  fill: $current-line;
  stroke-width: 0.5rem;
  transition: all 0.5s ease;
}

.hc-cell use.active:hover {
  cursor: pointer;
  fill: $comment;
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

.hc-scorepanel {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}

.hc-playername {
  display: flex;
  align-items: center;
  font-weight: 900;
  margin-bottom: 1rem;
}

.hc-tag {
  margin-left: 0.5rem;
}

.hc-scorebar {
  display: flex;
  margin-bottom: 0.125rem;
}

.hc-scorepoint {
  height: 0.75rem;
  width: 0.75rem;
  margin-right: 0.125rem;
  opacity: calc((1 / 18) * var(--point));
}

.hc-score-id {
  border: 1px solid $foreground;
  margin-right: 0.5rem;
}

.hc-scorepoint.red {
  background-color: $red;
}

.hc-scorepoint.green {
  background-color: $green;
}

.hc-scorepoint.yellow {
  background-color: $yellow;
}

.hc-scorepoint.purple {
  background-color: $purple;
}

.hc-scorepoint.orange {
  background-color: $orange;
}

.hc-scorepoint.blue {
  background-color: $cyan;
}

.hc-scorepoint:not(.active):not(.hc-score-id) {
  background-color: $current-line;
  opacity: 0.5;
}

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}

.hc-border {
  position: relative;
  z-index: 0;
  border-radius: 6px;
  overflow: hidden;
  padding: 1rem;

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    left: -50%;
    top: -100%;
    width: 200%;
    height: 300%;
    background-color: $comment;
    background-repeat: no-repeat;
    background-size: 50% 50%, 50% 50%;
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
    background-image: linear-gradient($comment, $comment),
      linear-gradient($comment, $comment);
    opacity: 0.5;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: 2px;
    top: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    background: $background;
    border-radius: 4px;
  }

  &.active::before {
    animation: rotate 5s linear infinite;
    background-color: $background;
    opacity: 1;
  }
}
</style>
