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
import { GameController } from 'src/controllers/game.controller';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private players: Map<string, Player>;
  private games: Map<string, GameController>;
  private logger: Logger;

  constructor() {
    this.players = new Map();
    this.games = new Map();
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

  @SubscribeMessage(SocketEvents.CREATE_GAME)
  handleCreateGame(socket: Socket, payload: any): WsResponse<unknown> {
    const player = this.players.get(socket.id);

    if (!player) {
      throw new WsException('player_not_found');
    }

    const game = new GameController(player);
    this.games.set(game.id, game);
    const event = SocketEvents.GAME_CREATED;
    return { event, data: game.id };
  }

  @SubscribeMessage(SocketEvents.JOIN_GAME)
  handleJoinGame(socket: Socket, payload: any): WsResponse<unknown> {
    const player = this.players.get(socket.id);
    if (!player) {
      throw new WsException('player_not_found');
    }

    const game = this.games.get(payload.gameId);
    if (!game) {
      throw new WsException('game_not_found');
    }

    try {
      game.addPlayer(player);
    } catch (e) {
      throw new WsException(e.message);
    }
    socket.join(payload.gameId);

    const event = 'gameStateChanged';
    return { event, data: game.getGameState() };
  }
}
