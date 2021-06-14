import io from 'socket.io-client';
import store from '@/store';

const initParams = new Map([
    ["name", store.state.name],
    ["id", store.state.socketId]
])
    
const query = Object.keys(initParams)
    .map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(initParams.get(key))}`;
    })
    .join("&");

const isDev = process.env.NODE_ENV === "development";
const socket = isDev ? io("http://localhost:3000") : io();

export default socket;