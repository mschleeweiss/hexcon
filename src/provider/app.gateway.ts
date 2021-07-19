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
import { User } from '../entities/user';
import { SocketEvents } from 'src/constants/socketevents';
import { GameController } from 'src/controllers/game.controller';
import { Player } from 'src/entities/player';
import { Move } from 'src/entities/move';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: Map<string, User>;
  private games: Map<string, GameController>;
  private logger: Logger;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.logger = new Logger('AppGateway');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const oldId = client.handshake.query.id as string;
    const name = client.handshake.query.name as string;

    let player = this.users.get(oldId);
    if (player) {
      player.id = client.id;
      this.users.delete(oldId);
    } else {
      player = new User(client.id, name);
    }
    this.users.set(client.id, player);

    client.emit('clientConnected', client.id);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(SocketEvents.CHANGE_NAME)
  handleChangeName(socket: Socket, payload: any): void {
    const player = this.users.get(socket.id);
    if (!player) {
      throw new WsException('player_not_found');
    }

    player.name = payload.name;
  }

  @SubscribeMessage(SocketEvents.CREATE_GAME)
  handleCreateGame(client: Socket, payload: any): WsResponse<unknown> {
    const player = this.users.get(client.id);

    if (!player) {
      throw new WsException('player_not_found');
    }

    const game = new GameController(player);
    this.games.set(game.id, game);
    const event = SocketEvents.GAME_CREATED;
    return { event, data: game.id };
  }

  @SubscribeMessage(SocketEvents.JOIN_GAME)
  handleJoinGame(client: Socket, payload: any): void {
    const user = this.users.get(client.id);
    if (!user) {
      throw new WsException('player_not_found');
    }

    const game = this.games.get(payload.gameId);
    if (!game) {
      throw new WsException('game_not_found');
    }

    try {
      game.addPlayer(user);
    } catch (e) {
      throw new WsException(e.message);
    }
    client.join(payload.gameId);

    const event = 'gameStateChanged';
    this.server.to(payload.gameId).emit(event, game.getEmittableState());
  }

  @SubscribeMessage(SocketEvents.TOGGLE_READINESS)
  handleChangeReadiness(client: Socket, payload: any): void {
    const user = this.users.get(client.id);
    if (!user) {
      throw new WsException('player_not_found');
    }

    const game = this.games.get(payload.gameId);
    if (!game) {
      throw new WsException('game_not_found');
    }

    try {
      game.changeReadiness(user);
    } catch (e) {
      throw new WsException(e.message);
    }

    const event = 'gameStateChanged';
    this.server.to(payload.gameId).emit(event, game.getEmittableState());
  }

  @SubscribeMessage(SocketEvents.START_GAME)
  handleStartGame(client: Socket, payload: any): void {
    const user = this.users.get(client.id);
    if (!user) {
      throw new WsException('player_not_found');
    }

    const game = this.games.get(payload.gameId);
    if (!game) {
      throw new WsException('game_not_found');
    }

    try {
      game.startGame(user);
    } catch (e) {
      throw new WsException(e.message);
    }

    const event = 'gameStateChanged';
    this.server.to(payload.gameId).emit(event, game.getEmittableState());
  }

  @SubscribeMessage(SocketEvents.REFRESH_TILES)
  handleRefreshTiles(client: Socket, payload: any): Array<unknown> {
    const game = this.games.get(payload.gameId);
    if (!game) {
      throw new WsException('game_not_found');
    }

    const player = game.players.find((player: Player) => player.user.id === client.id);
    if (!player) {
      throw new WsException('player_not_found');
    }

    return player.tiles;
  }

  @SubscribeMessage(SocketEvents.PLACE_TILE)
  handlePlaceTile(client: Socket, payload: any): Object {
    const user = this.users.get(client.id);
    if (!user) {
      throw new WsException('player_not_found');
    }

    const game = this.games.get(payload.gameId);
    if (!game) {
      throw new WsException('game_not_found');
    }

    const move = new Move(user, payload.tile);
    try {
      game.makeMove(move);
    } catch (e) {
      return { success: false, msg: e.message };
    }

    const event = 'gameStateChanged';
    this.server.to(payload.gameId).emit(event, game.getEmittableState());

    return { success: true, msg: "" };
  }

  @SubscribeMessage(SocketEvents.SWAP_TILES)
  handleSwapTiles(client: Socket, payload: any): Array<unknown>  {
    const user = this.users.get(client.id);
    if (!user) {
      throw new WsException('player_not_found');
    }

    const game = this.games.get(payload.gameId);
    if (!game) {
      throw new WsException('game_not_found');
    }

    game.swapTiles(user, payload.shouldSwap);

    const player = game.players.find((player: Player) => player.user.id === client.id);
    if (!player) {
      throw new WsException('player_not_found');
    }
    
    const event = 'gameStateChanged';
    this.server.to(payload.gameId).emit(event, game.getEmittableState());

    return player.tiles;
  }
}
