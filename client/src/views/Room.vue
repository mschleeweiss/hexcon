<template>
  <div class="hc-room">
    <NotFound v-if="notFound" />
    <RoomFull v-if="roomFull" />
    <div v-if="!notFound">
    <h1>Lobby</h1>
    <p>{{game}}</p>
    </div>
  </div>
</template>

<script>
import NotFound from '@/components/NotFound.vue'
import RoomFull from '@/components/RoomFull.vue'

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
      roomFull: false
    }
  },
  computed: {
    gameId() {
      return this.$route.params.gameid;
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
      console.log(game);
      this.game = game;
    },
    exception(data) {
      this.notFound = data.message === 'game_not_found';
      this.roomFull = data.message === 'room_full'
    },
  },
};
</script>

<style lang="scss" scoped>
.hc-room {
  height: 100%;
}
</style>
