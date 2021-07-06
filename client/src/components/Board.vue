<template>
  <div class="hc-board">
    <div class="hc-playerstats">
      <div
        class="hc-scorepanel"
        v-for="player in players"
        :key="player.user.id"
      >
        <div
          v-for="score in player.score.values"
          :key="score.type"
          class="hc-scorebar"
        >
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
    <svg class="hc-map" viewBox="-1000 -1000 2000 2000">
      <defs>
        <g id="pod">
          <polygon :points="hexPoints" />
        </g>
      </defs>
      <g class="hc-cell">
        <use
          :class="[calcColor(cell.type), { active: cell.type === 0 }]"
          v-for="cell in map"
          :key="cell"
          xlink:href="#pod"
          :transform="calcTransformation(cell.coords)"
        />
      </g>
    </svg>
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
  width: 40%;
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
}

.hc-scorebar {
  display: flex;
  margin-bottom: 0.25rem;
}

.hc-scorepoint {
  height: 1rem;
  width: 0.5rem;
  margin-right: 0.25rem;
  opacity: calc((1 / 18) * var(--point));
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

.hc-scorepoint:not(.active) {
    background-color: $current-line;
    opacity: 0.5;
}
</style>
