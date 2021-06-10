import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Player } from '../entities/player';
import { SocketEvents } from 'src/constants/socketevents';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private players: Map<string, Player>;
  private logger: Logger;

  constructor() {
    this.players = new Map();
    this.logger = new Logger('AppGateway');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const oldId = client.handshake.query.id as string;
    const name = client.handshake.query.name as string;

    let player = this.players.get(oldId);
    if (player) {
      player.id = client.id;
      this.players.delete(oldId);
    } else {
      player = new Player(client.id, name);
    }
    this.players.set(client.id, player);

    client.emit('clientConnected', client.id);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(SocketEvents.CHANGE_NAME)
  handleChangeName(socket: Socket, payload: any): void {
    const player = this.players.get(socket.id);
    if (!player) {
      throw new WsException('player_not_found');
    }

    player.name = payload.name;
  }
}
