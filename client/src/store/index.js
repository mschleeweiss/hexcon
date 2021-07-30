import { createStore } from 'vuex'
import generateName from '@/generator'

if (!sessionStorage.socketId) {
  sessionStorage.socketId = ''
}

if (!localStorage.name) {
  localStorage.name = generateName()
  localStorage.isNameGenerated = true;
}

export default createStore({
  state: {
    socketId: sessionStorage.socketId,
    name: localStorage.name
  },
  mutations: {
    updateSocketId (state, id) {
      state.socketId = id
      sessionStorage.socketId = id
    },
    updateName (state, name) {
      state.name = name
      localStorage.name = name
    }
  },
  actions: {
  },
  modules: {
  }
})
