<template>
  <div class="hc-gameover" :class="{ winner: isWinner }">
    <canvas ref="confettiCanvas" class="hc-confetti" />
    <div class="hc-header">
      <h1 class="hc-title hc-nova">Game Over</h1>
    </div>
    <div class="hc-content">
      <div class="hc-ranking">
        <div class="hc-winner">
          <i class="fas fa-trophy"></i>
          <span class="hc-name">{{ winner.user.name }}</span>
          <span class="hc-info">{{ winner.moveCount }} moves / {{ formatMilliseconds(winner.thinkTimeInMS) }} thinking time</span>
        </div>
        <table class="hc-losers">
          <tr>
            <th style="width: 1rem"></th>
            <th style="text-align: right; width: 1rem">#</th>
            <th style="text-align: left">Name</th>
            <th style="text-align: right">Moves</th>
            <th style="text-align: right">Time</th>
          </tr>
          <tr v-for="(player, idx) in notWinners" :key="player.user.id">
            <td style="text-align: center">
              <i class="fas fa-award" :class="calcRankColor(idx + 2)"></i>
            </td>
            <td style="text-align: right">{{ idx + 2 }}</td>
            <td style="overflow-wrap: anywhere;">{{ player.user.name }}</td>
            <td style="text-align: right">{{ player.moveCount }}</td>
            <td style="text-align: right">{{ formatMilliseconds(player.thinkTimeInMS) }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="showRematch" class="hc-footer">
      <button
        class="hc-btn hc-btn-outline hc-nova dark"
        @click="startRematch"
      >
        Rematch
      </button>
    </div>
  </div>
</template>

<script>
import confetti from 'canvas-confetti';

export default {
  name: 'GameOver',
  props: {
    rankedPlayers: {
      type: Array,
      required: true,
      default: () => [],
    },
    showRematch: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mounted() {
    if (!this.isWinner) {
      return;
    }

    var winnerConfetti = confetti.create(this.$refs.confettiCanvas, {
      resize: true,
      useWorker: true,
    });

    (function fireLeft() {
      // launch a few confetti from the left edge
      winnerConfetti({
        particleCount: 7,
        angle: 45,
        spread: 55,
        origin: { x: 0 },
      });
      setTimeout(() => {
        requestAnimationFrame(fireLeft);
      }, Math.random() * 1000 + 500);
    })();
    (function fireRight() {
      // launch a few confetti from the left edge
      winnerConfetti({
        particleCount: 7,
        angle: 135,
        spread: 55,
        origin: { x: 1 },
      });
      setTimeout(() => {
        requestAnimationFrame(fireRight);
      }, Math.random() * 1000 + 500);
    })();
  },
  computed: {
    isWinner() {
      return this.socketId === this.winner.user.id;
    },
    gameId() {
      return this.$route.params.gameid;
    },
    socketId() {
      return this.$store.state.socketId;
    },
    winner() {
      return this.rankedPlayers[0];
    },
    notWinners() {
      return this.rankedPlayers.filter((player, i) => i);
    },
  },
  methods: {
    calcRankColor(rank) {
      const mapping = {
        1: 'gold',
        2: 'silver',
        3: 'bronze',
        4: 'copper',
      };
      return mapping[rank];
    },
    formatMilliseconds(ms) {
      return new Date(ms).toISOString().substr(11, 8);
    },
    startRematch() {
      this.$socket.client.emit('rematch', {
        gameId: this.gameId,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.hc-gameover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: $red;

  &.winner {
    background-color: $green;
  }
}

.hc-confetti {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hc-header {
  padding-top: 2rem;

  & h1 {
    color: $background;
    font-weight: 900;
  }
   }

.hc-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hc-ranking {
  display: inline-block;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $background;
  width: 25rem;
  border-radius: 0.25rem;
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 25%);

  & .gold {
    color: $gold;
  }

  & .silver {
    color: $silver;
  }

  & .bronze {
    color: $bronze;
  }

  & .copper {
    color: $copper;
  }
}

.hc-winner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $current-line;
  padding: 1rem 3rem;
  border-radius: 0.25rem 0.25rem 0rem 0rem;

  & .hc-name {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    overflow-wrap: anywhere;
  }

  & .hc-info {
    font-size: 0.6rem;
  }

  & > i {
    color: $gold;
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
}

.hc-losers {
  width: 100%;

  & th {
    padding: 0.5rem;
  }

  & td {
    padding: 0.5rem;
  }
}

.hc-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 1rem;
}
</style>
