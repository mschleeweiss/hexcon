<template>
  <div class="hc-board">
    <div class="hc-container-left">
      <div class="hc-stats-container">
        <div
          class="hc-scorepanel hc-border-animated"
          :class="{
            active:
              currentPlayer?.user?.id === player.user.id &&
              isClientCurrentPlayer,
          }"
          v-for="player in players"
          :key="player.user.id"
        >
          <div class="hc-playername">
            {{ player.user.name }}
            <span v-if="socketId === player.user.id" class="hc-tag">You</span>
            <span
              v-if="currentPlayer?.user?.id === player.user.id"
              class="hc-tag success"
              >Current</span
            >
            <span v-if="!player.user.connected" class="hc-tag error"
              >Disconnected</span
            >
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
              :class="[calcColor(score.type), { active: point <= score.value }]"
              :style="`--point:${point}`"
            />
            <span>
              {{ score.value }}
            </span>
          </div>
        </div>
      </div>
      <div class="hc-gamelog-container">
        <div class="hc-gamelog hc-panel">
          <span class="hc-label">History</span>
          <div class="hc-messages" ref="messages" v-html="message" />
        </div>
      </div>
    </div>
    <!-- center div -->
    <div class="hc-container-center">
      <div
        class="hc-snackbar top success"
        :class="{
          show: showExtraTurnSnackBar,
          hide: !showExtraTurnSnackBar,
        }"
      >
        <h4 class="hc-nova">
          {{
            isClientCurrentPlayer
              ? 'You have'
              : `${currentPlayer?.user?.name} has`
          }}
          gained an extra turn
        </h4>
      </div>
      <div
        class="hc-snackbar top"
        :class="{
          show: state === 'awaitingSwap' && !isClientCurrentPlayer,
          hide: state !== 'awaitingSwap' || isClientCurrentPlayer,
        }"
      >
        <h4 class="hc-nova">
          {{ currentPlayer?.user?.name }} can swap all tiles
        </h4>
        They have no tile with their lowest color(s) and therefore have the
        choice to return their current tiles and drawing completely new ones.
      </div>
      <div
        class="hc-snackbar dark top"
        :class="{
          show: state === 'awaitingSwap' && isClientCurrentPlayer,
          hide: state !== 'awaitingSwap' || !isClientCurrentPlayer,
        }"
      >
        <h4 class="hc-nova">Swap all tiles?</h4>
        You have no tiles with the color of your lowest scoring color. Do you
        want to return all of your current tiles and draw new ones?

        <div>
          <button
            class="hc-btn hc-btn-outline hc-nova emphasized"
            @click="submitSwapDecision(true)"
          >
            Swap all tiles
          </button>
          <button
            class="hc-btn hc-btn-outline hc-nova"
            @click="submitSwapDecision(false)"
          >
            Resume
          </button>
        </div>
      </div>

      <svg :viewBox="mapViewBox" @contextmenu="rotateSelectedTile">
        <g
          class="hc-cell"
          v-for="cell in map"
          :key="cell"
          :transform="calcTransformation(cell.coords)"
        >
          <polygon
            :data-coords="cell"
            :class="[
              calcColor(cell.type),
              {
                active: (cell.type === 0 || cell.temp) && isActive(),
                temp: cell.temp,
                latest: isLatest(cell),
              },
            ]"
            :points="hexPoints"
            @mouseover="visualizeMove(cell)"
            @click="makeMove($event, cell)"
          />
          <text
            v-if="cell.gains > 0"
            fill="black"
            stroke="none"
            font-size="3rem"
            text-anchor="end"
          >
            +{{ cell.gains }}
          </text>
        </g>
      </svg>
    </div>
    <!-- right div -->
    <div class="hc-container-right" :class="{ active: isActive() }">
      <div class="hc-playertiles hc-panel">
        <span class="hc-label">Your Tiles</span>
        <div
          v-for="tile in playerTiles"
          :key="tile"
          class="hc-playertile"
          :class="{ selected: tile === selectedTile }"
        >
          <svg
            class="hc-tile"
            :pointer-events="isActive() ? 'visiblePainted' : 'none'"
            :viewBox="tileViewBox"
            :transform="selectedTileRotation(tile)"
            @click="
              selectedTile = tile;
              selectedTileDirection = 0;
            "
          >
            <g class="hc-cell">
              <polygon
                :class="calcColor(tile.first)"
                :points="hexPoints"
                :transform="calcTransformation(defaultFirst)"
              />
              <polygon
                :class="calcColor(tile.second)"
                :points="hexPoints"
                :transform="calcTransformation(defaultSecond)"
              />
            </g>
          </svg>
          <button
            v-if="tile === selectedTile"
            class="hc-btn hc-btn-outline hc-nova"
            @click="rotateSelectedTile"
          >
            <i class="fas fa-redo"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- game over overlay -->
    <transition name="fade">
      <game-over
        v-if="state === 'over'"
        class="hc-gameover-container"
        :rankedPlayers="rankedPlayers"
      />
    </transition>
  </div>
</template>

<script>
import { Hex, Layout, Point } from '@/hex';
import GameOver from '@/components/GameOver.vue';

export default {
  name: 'Board',
  components: {
    GameOver,
  },
  props: {
    state: {
      type: String,
      required: true,
      default: '',
    },
    map: {
      type: Array,
      required: true,
      default: () => [],
    },
    moves: {
      type: Array,
      required: true,
      default: () => [],
    },
    players: {
      type: Array,
      required: true,
      default: () => [],
    },
    rankedPlayers: {
      type: Array,
      required: true,
      default: () => [],
    },
    message: {
      type: String,
      required: true,
      default: '-',
    },
    currentPlayer: {
      type: Object,
      required: true,
      default: () => {},
    },
    playerTiles: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  watch: {
    playerTiles() {
      this.selectedTile = undefined;
    },
    message() {
      this.scrollHistoryToBottom();
    },
    moves() {
      const latestMove = this.moves[this.moves.length - 1];

      if (latestMove.user.id === this.currentPlayer?.user.id) {
        this.showExtraTurnSnackBar = true;
        window.setTimeout(() => (this.showExtraTurnSnackBar = false), 4000);
      }
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
      defaultFirst: { q: 0, r: 0, s: 0 },
      defaultSecond: { q: 1, r: 0, s: -1 },
      selectedTile: undefined,
      selectedTileDirection: 0,
      showExtraTurnSnackBar: false,
    };
  },
  computed: {
    hexPoints() {
      return this.layout
        .polygonCorners(new Hex(0, 0, 0))
        .map((o) => `${Math.round(o.x)},${Math.round(o.y)}`)
        .join(' ');
    },
    mapViewBox() {
      const rightHex = this.cellToHex(this.map[this.map.length - 1]);
      const point = this.layout.polygonCorners(rightHex)[0];

      const offset = Math.ceil(point.x);
      const size = offset * 2;

      return `-${offset} -${offset} ${size} ${size}`;
    },
    tileViewBox() {
      const leftPoints = this.layout.polygonCorners(new Hex(0, 0, 0));
      const rightPoints = this.layout.polygonCorners(new Hex(1, 0, -1));

      const offsetX = Math.min(...leftPoints.map((p) => p.x));
      const offsetY = Math.min(...leftPoints.map((p) => p.y));

      const sizeX = Math.max(...rightPoints.map((p) => p.x)) - offsetX;
      const sizeY = Math.max(...rightPoints.map((p) => p.y)) - offsetY;

      return `${offsetX} ${offsetY} ${sizeX} ${sizeY}`;
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
    isClientCurrentPlayer() {
      return this.socketId === this.currentPlayer?.user?.id;
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
    hexToCell(hex) {
      return this.map.find(
        (o) =>
          o.coords.q === hex.q && o.coords.r === hex.r && o.coords.s === hex.s,
      );
    },
    isActive() {
      return this.isClientCurrentPlayer && this.state === 'awaitingMove';
    },
    isLatest(cell) {
      return this.moves[this.moves.length - 1]?.cells.some(
        (c) =>
          c.q === cell.coords.q &&
          c.r === cell.coords.r &&
          c.s === cell.coords.s,
      );
    },
    rotateSelectedTile(event) {
      this.selectedTileDirection = (this.selectedTileDirection + 5) % 6;
      if (event.type === 'contextmenu') {
        const cell = document.elementFromPoint(event.clientX, event.clientY);
        cell.dispatchEvent(new Event('mouseover'));
        event.preventDefault();
      }
    },
    scrollHistoryToBottom() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$refs.messages.lastElementChild?.scrollIntoView({
            behavior: 'smooth',
          });
        });
      });
    },
    selectedTileRotation(tile) {
      if (tile === this.selectedTile) {
        return `rotate(-${60 * this.selectedTileDirection})`;
      }
      return '';
    },
    visualizeMove(firstCell) {
      if (!this.selectedTile) {
        return;
      }

      this.map.forEach((cell) => {
        if (cell.temp) {
          cell.type = 0;
          delete cell.temp;
        }
        cell.gains = 0;
      });

      const firstHex = this.cellToHex(firstCell);
      const secondHex = firstHex.neighbor(this.selectedTileDirection);
      const secondCell = this.hexToCell(secondHex);

      if (firstCell.type === 0 && secondCell?.type === 0) {
        firstCell.temp = true;
        firstCell.type = this.selectedTile.first;
        secondCell.temp = true;
        secondCell.type = this.selectedTile.second;

        for (let i = 0; i < Hex.directions.length; ++i) {
          let curr = this.hexToCell(firstHex.neighbor(i));
          while (curr && curr.type === firstCell.type && !curr.temp) {
            curr.gains = (curr.gains ?? 0) + 1;
            curr = this.hexToCell(this.cellToHex(curr).neighbor(i));
          }

          curr = this.hexToCell(secondHex.neighbor(i));
          while (curr && curr.type === secondCell.type && !curr.temp) {
            curr.gains = (curr.gains ?? 0) + 1;
            curr = this.hexToCell(this.cellToHex(curr).neighbor(i));
          }
        }
      }
    },
    makeMove(event, firstCell) {
      if (!event.target.className.baseVal.includes('active')) {
        return;
      }

      if (!this.selectedTile) {
        return;
      }

      const firstHex = this.cellToHex(firstCell);
      const secondHex = firstHex.neighbor(this.selectedTileDirection);
      const secondCell = this.hexToCell(secondHex);
      this.$emit('make-move', { firstCell, secondCell });
      this.selectedTileDirection = 0;
    },
    submitSwapDecision(swap) {
      this.$emit('swap', swap);
    },
  },
  mounted() {
    this.$emit('mounted');
    this.scrollHistoryToBottom();
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

.hc-flex-wrap {
  display: flex;
  align-items: center;
  justify-content: center;

  &.vertical {
    flex-direction: column;
  }
}

.hc-container-left {
  width: 21rem;
  min-width: 21rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  background-color: $current-line;
}

.hc-stats-container {
  padding: 1rem;
  overflow: auto;
}

.hc-gamelog-container {
  padding: 1rem;
  height: 10rem;
}
.hc-gamelog {
  font-size: 0.6rem;
  height: 100%;

  & > div {
    height: 6rem;
    overflow: auto;
  }

  & :deep(.red) {
    color: $red;
  }
  & :deep(.green) {
    color: $green;
  }
  & :deep(.yellow) {
    color: $yellow;
  }
  & :deep(.purple) {
    color: $purple;
  }
  & :deep(.orange) {
    color: $orange;
  }
  & :deep(.blue) {
    color: $cyan;
  }
}

.hc-container-center {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  overflow: auto;
  flex-grow: 1;
}

.hc-snackbar {
  background-color: $orange;
  color: $background;

  &.dark {
    background-color: $background;
    color: $foreground;
    text-align: left;
  }

  &.success {
    background-color: $green;
  }

  & > div {
    margin-top: 1rem;
  }
}

.hc-container-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10rem;
  min-width: 10rem;
  height: 100%;
  padding: 1rem;
  background-color: $current-line;
  opacity: 0.5;
  overflow: auto;
  transition: all 0.5s ease;
}

.hc-container-right.active {
  opacity: 1;
}

.hc-container-right svg {
  height: 3rem;
  cursor: pointer;
}

.hc-playertiles {
  background-color: $background;
  padding: 1rem 0rem 0rem 0rem;

  & > div {
    position: relative;
    padding: 0rem 1rem;
    text-align: center;
    transition: all 0.3s ease-out;

    &:last-child:not(.selected) {
      padding-bottom: 1rem;
    }

    &.selected {
      height: 6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $comment;
      margin: 0.5rem 0rem;

      &:last-child {
        margin-bottom: 0;
      }

      & .hc-cell polygon {
        stroke: $comment;
      }
    }

    & > .hc-btn {
      position: absolute;
      top: 0;
      right: 0;
      border: 0;
      padding: 0.125rem;
      margin: 0.25rem;
    }
  }
}

.hc-container-center svg {
  height: 100%;
}

.hc-cell polygon {
  stroke: $background;
  fill: $current-line;
  stroke-width: 0.5rem;
  transition: fill 0.5s ease;

  &.active:hover {
    cursor: pointer;
  }
  &.red {
    fill: $red;
  }
  &.green {
    fill: $green;
  }
  &.yellow {
    fill: $yellow;
  }
  &.purple {
    fill: $purple;
  }
  &.orange {
    fill: $orange;
  }
  &.blue {
    fill: $cyan;
  }
  &.temp {
    opacity: 0.6;
  }
  &.latest {
    animation: blinker 0.2s step-start 5;
  }

  @keyframes blinker {
    50% {
      fill: $current-line;
    }
  }
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

  & > span {
    font-size: 0.6rem;
    width: 0.9rem;
    text-align: right;
  }
}

.hc-scorepoint {
  height: 0.7rem;
  width: 0.7rem;
  margin-right: 0.125rem;
  opacity: calc(0.4 + (0.6 / 18) * var(--point));

  &.red {
    background-color: $red;
  }
  &.green {
    background-color: $green;
  }
  &.yellow {
    background-color: $yellow;
  }
  &.purple {
    background-color: $purple;
  }
  &.orange {
    background-color: $orange;
  }
  &.blue {
    background-color: $cyan;
  }
  &:not(.active):not(.hc-score-id) {
    background-color: $current-line;
    opacity: 0.5;
  }
}

.hc-score-id {
  border: 1px solid $foreground;
  margin-right: 0.5rem;
}

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}

.hc-border {
  border: 2px solid $comment;
  border-radius: 6px;
  padding: 1rem 0rem;

  &.hc-playertiles {
    padding-bottom: 0rem;
  }
}

.hc-panel {
  position: relative;
  width: 100%;
  background-color: $background;
  border: 2px solid $comment;
  border-radius: 6px;
  padding: 1rem;

  &.hc-playertiles {
    padding: 1rem 0rem 0rem 0rem;
  }
}

.hc-border-animated {
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
    background-color: $current-line;
    background-repeat: no-repeat;
    background-size: 50% 50%, 50% 50%;
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
    background-image: linear-gradient($current-line, $current-line),
      linear-gradient($current-line, $current-line);
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
    background-color: $green;
    opacity: 1;
  }
}

.hc-label {
  margin-top: -1.5rem;
  margin-left: 1rem;
  font-size: 0.75rem;
  font-weight: 900;
  background-color: $background;
  position: absolute;
  padding: 0rem 0.25rem;
  text-transform: uppercase;
}

.hc-btn {
  margin-left: 0.5rem;
}

.hc-gameover-container {
  position: absolute;
  left: 21rem;
  width: calc(100% - 21rem);
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease 3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
