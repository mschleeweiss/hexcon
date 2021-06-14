import io from 'socket.io-client'
import store from '@/store'

const initParams = {
  name: store.state.name,
  id: store.state.socketId
}

const options = {
  query: initParams
}

const isDev = process.env.NODE_ENV === 'development'
const socket = isDev ? io('http://localhost:3000', options) : io(options)

export default socket
