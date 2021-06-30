<template>
  <svg class="hc-board" viewBox="-1000 -1000 2000 2000">
    <defs>
      <g id="pod">
        <polygon :points="hexPoints" />
      </g>
    </defs>
    <g class="hc-cell">
      <use
        :class="{
          active: cell[1] === 0,
          red: cell[1] === 1,
          green: cell[1] === 2,
          yellow: cell[1] === 3,
          purple: cell[1] === 4,
          orange: cell[1] === 5,
          blue: cell[1] === 6,
        }"
        v-for="cell in map"
        :key="cell"
        xlink:href="#pod"
        :transform="calcTransformation(cell[0])"
      />
    </g>
  </svg>
</template>

<script>
import { Hex, Layout, Point } from '@/hex';

export default {
  name: 'Board',
  props: {
    map: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
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
  },
  methods: {
    calcTransformation(coords) {
      const hex = new Hex(coords.q, coords.r, coords.s);
      const point = this.layout.hexToPixel(hex);
      return `translate(${point.x},${point.y})`;
    },
  },
};
</script>

<style lang="scss" scoped>

.hc-board {
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
</style>
