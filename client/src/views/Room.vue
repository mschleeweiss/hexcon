<template>
  <div class="hc-room">
    <NotFound v-if="notFound" />
    <RoomFull v-if="roomFull" />
    <Lobby v-if="!notFound && !roomFull" :game="game" />
    <Board v-if="false" :map="map" />
  </div>
</template>

<script>
import NotFound from '@/components/NotFound.vue';
import RoomFull from '@/components/RoomFull.vue';
import Board from '@/components/Board.vue';
import Lobby from '@/components/Lobby.vue';

export default {
  name: 'Room',
  components: {
    Board,
    Lobby,
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
    players() {
      return this.game?.players ?? [];
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
